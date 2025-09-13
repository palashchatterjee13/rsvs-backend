import { Request, Response, NextFunction } from "express";
import MessStaff from "../models/MessStaff";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface authMessStaffTokenPayload {
    username: string;
    messID: {
        hostelNumber: number;
        academicYear: number;
        academicSession: "monsoon" | "spring";
    };
    staffNumber: number;
}

const authMessStaff = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.messStaffAuthToken;

        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Authentication token missing",
            });
        }

        const secret = process.env.SECRET;
        if (!secret) {
            return res.status(500).json({
                status: "error",
                message: "Server configuration error",
            });
        }

        let decoded: authMessStaffTokenPayload;
        try {
            decoded = jwt.verify(token, secret) as authMessStaffTokenPayload;
        } catch (err) {
            // Remove invalid or expired token
            res.clearCookie("messStaffAuthToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });
            return res.status(401).json({
                status: "error",
                message: "Invalid or expired token",
            });
        }

        if (!decoded.username || !decoded.messID || decoded.staffNumber === undefined) {
            res.clearCookie("messStaffAuthToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });
            return res.status(401).json({
                status: "error",
                message: "Invalid token payload",
            });
        }

        const staff = await MessStaff.findOne({
            messID: {
                hostelNumber: decoded.messID.hostelNumber,
                academicYear: decoded.messID.academicYear,
                academicSession: decoded.messID.academicSession,
            },
            staffNumber: decoded.staffNumber,
        });

        if (!staff || staff.username !== decoded.username) {
            res.clearCookie("messStaffAuthToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });
            return res.status(401).json({
                status: "error",
                message: "Mess staff not found or invalid token",
            });
        }

        // Attach mess staff info to request for downstream handlers
        req.body.staffUsername = staff.username;
        req.body.messID = staff.messID;
        req.body.staffNumber = staff.staffNumber;

        next();
    } catch (error) {
        console.error("Mess staff authentication error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default authMessStaff;

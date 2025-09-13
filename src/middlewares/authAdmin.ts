import { Request, Response, NextFunction } from "express";
import Mess from "../models/Mess";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface authAdminTokenPayload {
    username: string;
    messID: {
        hostelNumber: number;
        academicYear: number;
        academicSession: "monsoon" | "spring";
    };
}

const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.adminAuthToken;

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

        let decoded: authAdminTokenPayload;
        try {
            decoded = jwt.verify(token, secret) as authAdminTokenPayload;
        } catch (err) {
            // Remove invalid or expired token
            res.clearCookie("adminAuthToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });
            return res.status(401).json({
                status: "error",
                message: "Invalid or expired token",
            });
        }

        if (!decoded.username || !decoded.messID) {
            res.clearCookie("adminAuthToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });
            return res.status(401).json({
                status: "error",
                message: "Invalid token payload",
            });
        }

        const mess = await Mess.findOne({
            messID: {
                hostelNumber: decoded.messID.hostelNumber,
                academicYear: decoded.messID.academicYear,
                academicSession: decoded.messID.academicSession,
            }
        });

        if (!mess || mess.adminUsername !== decoded.username) {
            res.clearCookie("adminAuthToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });
            return res.status(401).json({
                status: "error",
                message: "Admin not found or invalid token",
            });
        }

        // Attach admin info to request for downstream handlers
        req.body.adminUsername = mess.adminUsername;
        req.body.messID = mess.messID;

        next();
    } catch (error) {
        console.error("Admin authentication error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default authAdmin;

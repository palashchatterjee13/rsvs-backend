import { Request, Response, NextFunction } from "express";
import InCharge from "../models/InCharge";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface authInChargeTokenPayload {
    username: string;
}

const authInCharge = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.inChargeAuthToken;

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

        let decoded: authInChargeTokenPayload;
        try {
            decoded = jwt.verify(token, secret) as authInChargeTokenPayload;
        } catch (err) {
            // Remove the invalid or expired token
            res.clearCookie("inChargeAuthToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });
            return res.status(401).json({
                status: "error",
                message: "Invalid or expired token",
            });
        }

        if (!decoded.username || decoded.username !== "incharge@rsvs") {
            res.clearCookie("inChargeAuthToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });
            return res.status(401).json({
                status: "error",
                message: "Invalid token payload",
            });
        }

        const incharge = await InCharge.findOne({ username: decoded.username });
        if (!incharge) {
            res.clearCookie("inChargeAuthToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });
            return res.status(401).json({
                status: "error",
                message: "InCharge not found",
            });
        }

        // Attach incharge name to request body for further handlers
        req.body.inchargeName = (incharge as any).name;

        next();

    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default authInCharge;

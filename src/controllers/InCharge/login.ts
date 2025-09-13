import InCharge from "../../models/InCharge";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: "error",
                message: "Username and password are required",
            });
        }

        if (username !== "incharge@rsvs") {
            return res.status(401).json({
                status: "error",
                message: "Invalid username",
            });
        }

        const incharge = await InCharge.findOne({ username: "incharge@rsvs" });
        if (!incharge) {
            return res.status(404).json({
                status: "error",
                message: "InCharge not found",
            });
        }

        if (incharge.password !== password) {
            return res.status(401).json({
                status: "error",
                message: "Invalid password",
            });
        }

        const secret = process.env.SECRET;
        if (!secret) {
            return res.status(500).json({
                status: "error",
                message: "Server configuration error",
            });
        }

        const inChargeAuthToken = jwt.sign(
            { username: incharge.username },
            secret,
            { expiresIn: "7d" }
        );

        res.cookie("inChargeAuthToken", inChargeAuthToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            httpOnly: false,
            secure: true,
        });

        return res.status(200).json({
            status: "success",
            message: "Login Success",
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

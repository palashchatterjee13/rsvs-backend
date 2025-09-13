import { Request, Response } from "express";
import Mess from "../../models/Mess";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const adminLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: "error",
                message: "Username and password are required",
            });
        }

        // Find the mess with matching virtual username
        const messList = await Mess.find({});
        const mess = messList.find((m) => m.adminUsername === username);

        if (!mess) {
            return res.status(401).json({
                status: "error",
                message: "Invalid username",
            });
        }

        // Compare password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, mess.admin.password);
        if (!isPasswordValid) {
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

        const adminAuthToken = jwt.sign(
            {
                username: mess.adminUsername,
                messID: mess.messID,
            },
            secret,
            { expiresIn: "7d" }
        );

        res.cookie("adminAuthToken", adminAuthToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
            sameSite: "none",
            httpOnly: false,
            secure: true,
        });

        return res.status(200).json({
            status: "success",
            message: "Login Success",
        });

    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default adminLogin;

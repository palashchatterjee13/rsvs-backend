import { Request, Response } from "express";
import MessStaff from "../../models/MessStaff";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const messStaffLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: "error",
                message: "Username and password are required",
            });
        }

        // Find the mess staff with matching virtual username
        const messStaffList = await MessStaff.find({});
        const staff = messStaffList.find((s) => s.username === username);

        if (!staff) {
            return res.status(401).json({
                status: "error",
                message: "Invalid username",
            });
        }

        // Compare password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, staff.password);
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

        const messStaffAuthToken = jwt.sign(
            {
                username: staff.username,
                messID: staff.messID,
                staffNumber: staff.staffNumber,
            },
            secret,
            { expiresIn: "180d" } // Or any other appropriate duration
        );

        res.cookie("messStaffAuthToken", messStaffAuthToken, {
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
        console.error("Mess staff login error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default messStaffLogin;

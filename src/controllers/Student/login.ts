import { Request, Response } from "express";
import Student from "../../models/Student";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const studentLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: "error",
                message: "Username and password are required",
            });
        }

        // Find student by virtual username
        const studentList = await Student.find({});
        const student = studentList.find((s) => s.username === username.toLowerCase());

        if (!student) {
            return res.status(401).json({
                status: "error",
                message: "Invalid username",
            });
        }

        // Compare password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, student.password);
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

        // Token valid for 6 months
        const studentAuthToken = jwt.sign(
            {
                messID: student.messID,
                username: student.username,
                roomNumber: student.roomNumber,
                studentNumber: student.studentNumber,
            },
            secret,
            { expiresIn: "180d" } // ~6 months
        );

        res.cookie("studentAuthToken", studentAuthToken, {
            maxAge: 180 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            httpOnly: false,
            secure: true,
        });

        return res.status(200).json({
            status: "success",
            message: "Login Success",
        });

    } catch (error) {
        console.error("Student login error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default studentLogin;

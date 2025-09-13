import { Request, Response, NextFunction } from "express";
import Student from "../models/Student";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface authStudentTokenPayload {
    username: string;
    messID: {
        hostelNumber: number;
        academicYear: number;
        academicSession: "monsoon" | "spring";
    };
    roomNumber: number;
    studentNumber: number;
}

const authStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.studentAuthToken;

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

        let decoded: authStudentTokenPayload;
        try {
            decoded = jwt.verify(token, secret) as authStudentTokenPayload;
        } catch (err) {
            res.clearCookie("studentAuthToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });
            return res.status(401).json({
                status: "error",
                message: "Invalid or expired token",
            });
        }

        if (!decoded.username || !decoded.messID || decoded.roomNumber == null || decoded.studentNumber == null) {
            res.clearCookie("studentAuthToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });
            return res.status(401).json({
                status: "error",
                message: "Invalid token payload",
            });
        }

        const student = await Student.findOne({
            "messID.hostelNumber": decoded.messID.hostelNumber,
            "messID.academicYear": decoded.messID.academicYear,
            "messID.academicSession": decoded.messID.academicSession,
            roomNumber: decoded.roomNumber,
            studentNumber: decoded.studentNumber,
            deleted: false,
        });

        if (!student || student.username !== decoded.username) {
            res.clearCookie("studentAuthToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });
            return res.status(401).json({
                status: "error",
                message: "Student not found or invalid token",
            });
        }

        req.body.studentUsername = student.username;
        req.body.studentID = student.username;
        req.body.messID = student.messID;
        req.body.roomNumber = student.roomNumber;
        req.body.studentNumber = student.studentNumber;

        next();
    } catch (error) {
        console.error("Student authentication error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default authStudent;

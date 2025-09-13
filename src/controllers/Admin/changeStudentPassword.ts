import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Student from "../../models/Student";
import dotenv from "dotenv";

dotenv.config();

const changeStudentPassword = async (req: Request, res: Response) => {
    try {
        const { messID, roomNumber, studentNumber, newStudentPassword } = req.body;

        if (!messID || !roomNumber || !studentNumber || !newStudentPassword) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields: messID, roomNumber, studentNumber, or newStudentPassword",
            });
        }

        const student = await Student.findOne({
            studentNumber,
            roomNumber,
            "messID.hostelNumber": messID.hostelNumber,
            "messID.academicYear": messID.academicYear,
            "messID.academicSession": messID.academicSession,
        });

        if (!student) {
            return res.status(404).json({
                status: "error",
                message: "Student not found",
            });
        }

        if (!newStudentPassword || newStudentPassword.length < 8) {
            return res.status(400).json({
                status: "error",
                message: "New password must be at least 8 characters",
            });
        }

        const hashingSecret = process.env.HASHING_SECRET;
        if (!hashingSecret) {
            return res.status(500).json({
                status: "error",
                message: "Server hashing configuration missing",
            });
        }

        const salt = await bcrypt.genSalt(Number(hashingSecret));
        const hashedPassword = await bcrypt.hash(newStudentPassword, salt);

        student.password = hashedPassword;
        await student.save();

        return res.status(200).json({
            status: "success",
            message: "Student password updated successfully",
        });
    } catch (error) {
        console.error("Change student password error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default changeStudentPassword;

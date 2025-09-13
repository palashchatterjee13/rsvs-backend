import { Request, Response } from "express";
import Student from "../../models/Student";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const addStudent = async (req: Request, res: Response) => {
    try {
        const { messID, roomNumber, password, name } = req.body;

        if (!messID || !roomNumber || !password || !name) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields: messID, roomNumber, password, or name",
            });
        }

        if (typeof name !== "string" || name.trim().length < 1) {
            return res.status(400).json({
                status: "error",
                message: "Invalid name: must be a non-empty string",
            });
        }

        const hashingSecret = process.env.HASHING_SECRET;
        if (!hashingSecret) {
            return res.status(500).json({
                status: "error",
                message: "Server hashing configuration missing",
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(Number(hashingSecret));
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new student with name included
        const student = new Student({
            roomNumber,
            messID,
            name: name.trim(),
            password: hashedPassword,
        });

        // Save will trigger pre-save hook to assign studentNumber automatically
        await student.save();

        return res.status(201).json({
            status: "success",
            message: "Student added successfully",
            data: {
                name: student.name,
                studentNumber: student.studentNumber,
                username: student.username,
            },
        });

    } catch (error) {
        console.error("Add student error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default addStudent;

import MessStaff from "../../models/MessStaff";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const addMessStaff = async (req: Request, res: Response) => {
    try {
        const { messID, name, password } = req.body;

        if (!messID || !messID.hostelNumber || !messID.academicYear || !messID.academicSession) {
            return res.status(400).json({
                status: "error",
                message: "Mess ID (hostelNumber, academicYear, academicSession) is required",
            });
        }

        if (!name || !password) {
            return res.status(400).json({
                status: "error",
                message: "Name and password are required",
            });
        }

        const saltRounds = Number(process.env.HASHING_SECRET);
        if (!saltRounds || isNaN(saltRounds)) {
            return res.status(500).json({
                status: "error",
                message: "Server configuration error: HASHING_SECRET is invalid",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, Number(saltRounds));

        const newStaff = new MessStaff({
            name,
            password: hashedPassword,
            messID: {
                hostelNumber: messID.hostelNumber,
                academicYear: messID.academicYear,
                academicSession: messID.academicSession,
            },
        });

        await newStaff.save();

        return res.status(201).json({
            status: "success",
            message: "Mess staff added successfully",
            data: {
                staffNumber: newStaff.staffNumber,
                username: newStaff.username,
            },
        });
    } catch (error) {
        console.error("Error adding mess staff:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default addMessStaff;

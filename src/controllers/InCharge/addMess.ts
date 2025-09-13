import { Request, Response } from "express";
import Mess from "../../models/Mess";
import bcrypt from "bcryptjs";

const addMess = async (req: Request, res: Response) => {
    try {
        const { messID, startDate, endDate, adminName, adminPassword } = req.body;

        if (!messID || !messID.hostelNumber || !messID.academicYear || !messID.academicSession || !startDate || !endDate || !adminName || !adminPassword) {
            return res.status(400).json({
                status: "error",
                message: "All fields are required",
            });
        }

        // Check if mess already exists
        const existingMess = await Mess.findOne({
            "messID.hostelNumber": messID.hostelNumber,
            "messID.academicYear": messID.academicYear,
            "messID.academicSession": messID.academicSession,
        });

        if (existingMess) {
            return res.status(409).json({
                status: "error",
                message: "Mess with the provided messID already exists",
            });
        }

        // Get hashing secret from environment
        const saltRounds = Number(process.env.HASHING_SECRET);
        if (!saltRounds || isNaN(saltRounds)) {
            return res.status(500).json({
                status: "error",
                message: "Server configuration error: HASHING_SECRET is invalid",
            });
        }

        // Encrypt admin password
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

        const newMess = new Mess({
            messID: {
                hostelNumber: messID.hostelNumber,
                academicYear: messID.academicYear,
                academicSession: messID.academicSession,
            },
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            admin: {
                name: adminName,
                password: hashedPassword,
            },
        });

        await newMess.save();

        return res.status(201).json({
            status: "success",
            message: "Mess added successfully",
        });

    } catch (error) {
        console.error("Add mess error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default addMess;

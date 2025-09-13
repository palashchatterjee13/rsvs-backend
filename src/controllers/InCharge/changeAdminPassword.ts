import { Request, Response } from "express";
import Mess from "../../models/Mess";
import bcrypt from "bcryptjs";

const changeAdminPassword = async (req: Request, res: Response) => {
    try {
        const { messID, newAdminPassword } = req.body;

        if (
            !messID ||
            !messID.hostelNumber ||
            !messID.academicYear ||
            !messID.academicSession ||
            !newAdminPassword
        ) {
            return res.status(400).json({
                status: "error",
                message: "All fields are required",
            });
        }

        const mess = await Mess.findOne({
            "messID.hostelNumber": messID.hostelNumber,
            "messID.academicYear": messID.academicYear,
            "messID.academicSession": messID.academicSession,
        });

        if (!mess) {
            return res.status(404).json({
                status: "error",
                message: "Mess not found",
            });
        }

        if (!process.env.HASHING_SECRET) {
            return res.status(500).json({
                status: "error",
                message: "Server configuration error",
            });
        }

        const saltRounds = Number(process.env.HASHING_SECRET);
        if (!saltRounds || isNaN(saltRounds)) {
            return res.status(500).json({
                status: "error",
                message: "Server configuration error: HASHING_SECRET is invalid",
            });
        }

        const hashedPassword = await bcrypt.hash(newAdminPassword, saltRounds);

        mess.admin.password = hashedPassword;
        await mess.save();

        return res.status(200).json({
            status: "success",
            message: "Admin password updated successfully",
        });

    } catch (error) {
        console.error("Change admin password error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default changeAdminPassword;

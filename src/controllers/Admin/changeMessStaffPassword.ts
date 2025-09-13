import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import MessStaff from "../../models/MessStaff";
import dotenv from "dotenv";

dotenv.config();

const changeMessStaffPassword = async (req: Request, res: Response) => {
    try {
        const { messID, staffNumber, newMessStaffPassword } = req.body;

        if (!messID || !messID.hostelNumber || !messID.academicYear || !messID.academicSession) {
            return res.status(400).json({
                status: "error",
                message: "Mess ID (hostelNumber, academicYear, academicSession) is required",
            });
        }

        if (!staffNumber) {
            return res.status(400).json({
                status: "error",
                message: "Staff number is required",
            });
        }

        if (!newMessStaffPassword || newMessStaffPassword.length < 8) {
            return res.status(400).json({
                status: "error",
                message: "New password must be at least 8 characters",
            });
        }

        const staff = await MessStaff.findOne({
            staffNumber,
            "messID.hostelNumber": messID.hostelNumber,
            "messID.academicYear": messID.academicYear,
            "messID.academicSession": messID.academicSession,
        });

        if (!staff) {
            return res.status(404).json({
                status: "error",
                message: "Mess staff not found",
            });
        }

        if (staff.deleted) {
            return res.status(400).json({
                status: "error",
                message: "Cannot update a deleted mess staff",
            });
        }

        const hashingSecret = process.env.HASHING_SECRET;
        if (!hashingSecret) {
            return res.status(500).json({
                status: "error",
                message: "Server hashing secret not configured",
            });
        }

        const salt = await bcrypt.genSalt(Number(hashingSecret));
        const hashedPassword = await bcrypt.hash(newMessStaffPassword, salt);

        staff.password = hashedPassword;
        await staff.save();

        return res.status(200).json({
            status: "success",
            message: "Mess staff password updated successfully",
        });
    } catch (error) {
        console.error("Error changing mess staff password:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default changeMessStaffPassword;

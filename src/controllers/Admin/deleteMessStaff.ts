import { Request, Response } from "express";
import MessStaff from "../../models/MessStaff";

const deleteMessStaff = async (req: Request, res: Response) => {
    try {
        const { messID, staffNumber } = req.body;

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
                message: "Mess staff is already marked as deleted",
            });
        }

        staff.deleted = true;
        await staff.save();

        return res.status(200).json({
            status: "success",
            message: "Mess staff marked as deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting mess staff:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default deleteMessStaff;

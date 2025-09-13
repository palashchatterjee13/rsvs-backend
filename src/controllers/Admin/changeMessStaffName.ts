import { Request, Response } from "express";
import MessStaff from "../../models/MessStaff";

const changeMessStaffName = async (req: Request, res: Response) => {
    try {
        const { messID, staffNumber, newMessStaffName } = req.body;

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

        if (!newMessStaffName || newMessStaffName.trim().length < 3) {
            return res.status(400).json({
                status: "error",
                message: "New mess staff name must be at least 3 characters",
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

        staff.name = newMessStaffName.trim();
        await staff.save();

        return res.status(200).json({
            status: "success",
            message: "Mess staff name updated successfully",
        });
    } catch (error) {
        console.error("Error changing mess staff name:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default changeMessStaffName;

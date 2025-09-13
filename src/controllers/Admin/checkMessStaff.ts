import { Request, Response } from "express";
import MessStaff from "../../models/MessStaff";

const checkMessStaff = async (req: Request, res: Response) => {
    try {
        const { messID, username } = req.body;

        if (!messID || !username) {
            return res.status(400).json({
                status: "error",
                message: "messID and username are required",
            });
        }

        // Find all mess staff of the given messID that are not deleted
        const staffList = await MessStaff.find({
            "messID.hostelNumber": messID.hostelNumber,
            "messID.academicYear": messID.academicYear,
            "messID.academicSession": messID.academicSession,
            deleted: false,
        });

        const staff = staffList.find(s => s.username === username);

        if (!staff) {
            return res.status(404).json({
                status: "error",
                message: "Mess staff not found",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Mess staff found",
            data: {
                name: staff.name,
                staffNumber: staff.staffNumber,
            }
        });

    } catch (error) {
        console.error("Check mess staff error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default checkMessStaff;

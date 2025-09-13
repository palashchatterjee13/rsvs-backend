import { Request, Response } from "express";
import Mess from "../../models/Mess";

const changeAdminName = async (req: Request, res: Response) => {
    try {
        const { messID, newAdminName } = req.body;

        if (!messID || !messID.hostelNumber || !messID.academicYear || !messID.academicSession || !newAdminName) {
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

        mess.admin.name = newAdminName;
        await mess.save();

        return res.status(200).json({
            status: "success",
            message: "Admin name updated successfully",
        });

    } catch (error) {
        console.error("Change admin name error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default changeAdminName;

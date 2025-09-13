import { Request, Response } from "express";
import Mess from "../../models/Mess";

const viewMesses = async (req: Request, res: Response) => {
    try {
        // Ensure the request has incharge info (set by auth middleware)
        const currentYear = new Date().getFullYear();

        // Fetch all messes from the database
        const allMesses = await Mess.find({}).sort({
            "messID.academicYear": -1,
            "messID.academicSession": -1
        });

        // Separate messes into current and previous years
        const currentYearMesses = allMesses.filter(mess => mess.messID.academicYear === currentYear);
        const previousYearMesses = allMesses.filter(mess => mess.messID.academicYear < currentYear);

        return res.status(200).json({
            status: "success",
            message: "Messes fetched successfully",
            data: {
                currentYearMesses,
                previousYearMesses
            }
        });

    } catch (error) {
        console.error("Error fetching messes:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
};

export default viewMesses;

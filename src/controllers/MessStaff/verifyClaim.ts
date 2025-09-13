import { Request, Response } from "express";
import MealClaim from "../../models/MealClaim";

const verifyClaim = async (req: Request, res: Response) => {
    try {
        const { claimID, messID, staffNumber } = req.body;

        if (!claimID || !messID || staffNumber === undefined) {
            return res.status(400).json({
                status: "error",
                message: "Claim ID, mess ID, and staff number are required",
            });
        }

        const claim = await MealClaim.findById(claimID);

        if (!claim) {
            return res.status(404).json({
                status: "error",
                message: "Meal claim not found",
            });
        }

        if (claim.verified) {
            return res.status(400).json({
                status: "error",
                message: "Meal already claimed",
            });
        }

        // Check if the mess ID of the claim matches the mess ID of the staff
        if (
            claim.messID.hostelNumber !== messID.hostelNumber ||
            claim.messID.academicYear !== messID.academicYear ||
            claim.messID.academicSession !== messID.academicSession
        ) {
            return res.status(403).json({
                status: "error",
                message: "Unauthorized to verify this claim",
            });
        }

        // Mark the claim as verified
        claim.verified = true;
        await claim.save();

        return res.status(200).json({
            status: "success",
            message: "Meal claim verified successfully",
        });

    } catch (error) {
        console.error("Error verifying meal claim:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default verifyClaim;

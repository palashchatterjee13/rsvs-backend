import { Request, Response } from "express";
import MealClaim from "../../models/MealClaim";
import Student from "../../models/Student";
import moment from "moment-timezone";

const claimMeal = async (req: Request, res: Response) => {
    try {
        const { messID, studentID, mealType } = req.body;

        if (!messID || !studentID || !mealType) {
            return res.status(400).json({
                status: "error",
                message: "messID, studentID, and mealType are required",
            });
        }

        const validMeals = ["breakfast", "lunch", "snacks", "dinner"];
        const meal = mealType.toLowerCase();

        if (!validMeals.includes(meal)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid meal type",
            });
        }

        // Find students matching messID and not deleted
        const students = await Student.find({
            "messID.hostelNumber": messID.hostelNumber,
            "messID.academicYear": messID.academicYear,
            "messID.academicSession": messID.academicSession,
            deleted: false,
        });

        const student = students.find((s) => s.username === studentID);

        if (!student) {
            return res.status(404).json({
                status: "error",
                message: "Student not found or profile is deleted",
            });
        }

        // Get current date/time in IST
        const now = moment().tz("Asia/Kolkata");
        const date = now.date();
        const month = now.format("MMMM").toLowerCase();
        const year = now.year();

        // Define valid time windows with 10 minutes grace
        const validPeriods: { [key: string]: { start: string; end: string } } = {
            breakfast: { start: "07:20", end: "09:10" },
            lunch: { start: "12:20", end: "14:10" },
            snacks: { start: "17:05", end: "18:40" },
            dinner: { start: "20:20", end: "23:59" },
        };

        const period = validPeriods[meal];

        if (!period) {
            return res.status(400).json({
                status: "error",
                message: "Meal timing configuration error",
            });
        }

        const startTime = moment.tz(`${date}-${month}-${year} ${period.start}`, "DD-MMMM-YYYY HH:mm", "Asia/Kolkata");
        const endTime = moment.tz(`${date}-${month}-${year} ${period.end}`, "DD-MMMM-YYYY HH:mm", "Asia/Kolkata");

        if (!now.isBetween(startTime, endTime)) {
            return res.status(400).json({
                status: "error",
                message: "Not a valid time for claiming this meal",
            });
        }

        // Check if claim already exists
        const existingClaim = await MealClaim.findOne({
            "messID.hostelNumber": messID.hostelNumber,
            "messID.academicYear": messID.academicYear,
            "messID.academicSession": messID.academicSession,
            studentID: studentID,
            date,
            month,
            year,
            mealType: meal,
        });

        if (existingClaim && existingClaim.verified) {
            return res.status(400).json({
                status: "error",
                message: "Meal claim already made",
            });
        }

        let mealClaim;
        if (existingClaim) {
            mealClaim = existingClaim;
        } else {
            mealClaim = new MealClaim({
                messID,
                studentID,
                date,
                month,
                year,
                mealType: meal,
                verified: false,
            });
        }

        await mealClaim.save();

        return res.status(200).json({
            status: "success",
            message: "Meal claim processed",
            data: mealClaim,
        });

    } catch (error) {
        console.error("Claim meal error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default claimMeal;

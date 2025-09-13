import { Request, Response } from "express";
import Student from "../../models/Student";

const profileCompleted = async (req: Request, res: Response) => {
    try {
        const { messID, roomNumber, studentNumber } = req.body;
        // console.log(req.body)

        if (!messID || !messID.hostelNumber || !messID.academicYear || !messID.academicSession || !roomNumber || !studentNumber) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields",
            });
        }

        const student = await Student.findOne({
            "messID.hostelNumber": messID.hostelNumber,
            "messID.academicYear": messID.academicYear,
            "messID.academicSession": messID.academicSession,
            roomNumber: roomNumber,
            studentNumber: studentNumber,
            deleted: false,
        });

        if (!student) {
            return res.status(404).json({
                status: "error",
                message: "Student not found",
            });
        }

        const isComplete = student.name && student.email && student.phone && student.rollNumber;

        return res.status(200).json({
            status: "success",
            message: isComplete ? "complete" : "not complete",
        });

    } catch (error) {
        console.error("Profile check error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default profileCompleted;

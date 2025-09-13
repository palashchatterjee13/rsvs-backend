import { Request, Response } from "express";
import Student from "../../models/Student";

const checkStudent = async (req: Request, res: Response) => {
    try {
        const { messID, username } = req.body;

        if (!messID || !username) {
            return res.status(400).json({
                status: "error",
                message: "messID and username are required",
            });
        }

        // Find all students of the given messID that are not deleted
        const students = await Student.find({
            "messID.hostelNumber": messID.hostelNumber,
            "messID.academicYear": messID.academicYear,
            "messID.academicSession": messID.academicSession,
            deleted: false,
        });

        const student = students.find(s => s.username === username);

        if (!student) {
            return res.status(404).json({
                status: "error",
                message: "Student not found",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Student found",
            data: {
                name: student.name,
                roomNumber: student.roomNumber,
                studentNumber: student.studentNumber,
            }
        });

    } catch (error) {
        console.error("Check student error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default checkStudent;

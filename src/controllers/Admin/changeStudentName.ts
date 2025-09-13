import { Request, Response } from "express";
import Student from "../../models/Student";

const changeStudentName = async (req: Request, res: Response) => {
    try {
        const { messID, roomNumber, studentNumber, newStudentName } = req.body;

        if (!messID || !roomNumber || !studentNumber || !newStudentName) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields: messID, roomNumber, studentNumber, or newStudentName",
            });
        }

        const student = await Student.findOne({
            studentNumber,
            roomNumber,
            "messID.hostelNumber": messID.hostelNumber,
            "messID.academicYear": messID.academicYear,
            "messID.academicSession": messID.academicSession,
        });

        if (!student) {
            return res.status(404).json({
                status: "error",
                message: "Student not found",
            });
        }

        student.name = newStudentName;
        await student.save();

        return res.status(200).json({
            status: "success",
            message: "Student name updated successfully",
        });
    } catch (error) {
        console.error("Change student name error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default changeStudentName;

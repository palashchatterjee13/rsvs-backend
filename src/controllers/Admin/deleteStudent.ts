import { Request, Response } from "express";
import Student from "../../models/Student";

const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { messID, roomNumber, studentNumber } = req.body;

        if (!messID || !roomNumber || !studentNumber) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields: messID, roomNumber, or studentNumber",
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

        // Soft delete
        student.deleted = true;
        await student.save();

        return res.status(200).json({
            status: "success",
            message: "Student marked as deleted successfully",
        });
    } catch (error) {
        console.error("Delete student error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default deleteStudent;

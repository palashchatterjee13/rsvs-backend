import { Request, Response } from "express";
import Student from "../../models/Student";

const completeProfile = async (req: Request, res: Response) => {
    try {
        const { messID, roomNumber, studentNumber, name, email, phone, rollNumber } = req.body;

        if (!messID || !messID.hostelNumber || !messID.academicYear || !messID.academicSession || !roomNumber || !studentNumber) {
            return res.status(400).json({
                status: "error",
                message: "Missing required identifiers",
            });
        }

        if (!name || !email || !phone || !rollNumber) {
            return res.status(400).json({
                status: "error",
                message: "All fields must be provided",
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

        student.name = name;
        student.email = email;
        student.phone = phone;
        student.rollNumber = rollNumber;

        await student.save();

        return res.status(200).json({
            status: "success",
            message: "Profile completed successfully",
        });

    } catch (error) {
        console.error("Complete profile error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export default completeProfile;

import mongoose, { Schema, Model, Types } from "mongoose";
import IStudent from "../interfaces/IStudent";
import { MessIDSchema } from "./Mess";

interface StudentCounter {
    roomNumber: number;
    messID: {
        hostelNumber: number;
        academicYear: number;
        academicSession: string;
    };
    seq: number;
}

const StudentCounterSchema = new Schema<StudentCounter>({
    roomNumber: { type: Number, required: true },
    messID: {
        type: MessIDSchema,
        required: true,
    },
    seq: { type: Number, default: 0 },
});

const StudentCounter = mongoose.model<StudentCounter>("StudentCounter", StudentCounterSchema);

const StudentSchema = new Schema<IStudent>({
    studentNumber: {
        type: Number,
        required: true,
    },
    roomNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 9999,
    },
    messID: {
        type: MessIDSchema,
        required: true,
    },
    name: {
        type: String,
        minlength: 3,
        maxlength: 128,
    },
    rollNumber: {
        type: String,
        minlength: 3,
        maxlength: 128,
    },
    phone: {
        type: String,
        minlength: 10,
        maxlength: 10,
    },
    email: {
        type: String,
        minlength: 3,
        maxlength: 128,
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 256,
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => new Date(),
        immutable: true,
    },
    updatedAt: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
});

// Composite unique index across studentNumber, roomNumber, messID
StudentSchema.index({
    studentNumber: 1,
    roomNumber: 1,
    "messID.hostelNumber": 1,
    "messID.academicSession": 1,
    "messID.academicYear": 1,
}, { unique: true });

// Virtual for username
StudentSchema.virtual("username").get(function (this: IStudent) {
    return `S${this.studentNumber}R${this.roomNumber}.${this.messID.academicSession}.${this.messID.academicYear}@hostel${this.messID.hostelNumber}`.toLowerCase();
});

// Instance methods
StudentSchema.methods.updateName = function (this: IStudent, newName: string) {
    this.name = newName;
    return this.save();
};

StudentSchema.methods.updateRollNumber = function (this: IStudent, newRollNumber: string) {
    this.rollNumber = newRollNumber;
    return this.save();
};

StudentSchema.methods.updatePhone = function (this: IStudent, newPhone: string) {
    this.phone = newPhone;
    return this.save();
};

StudentSchema.methods.updateEmail = function (this: IStudent, newEmail: string) {
    this.email = newEmail;
    return this.save();
};

StudentSchema.methods.validateUsername = function (this: IStudent, inputUsername: string) {
    return this.username === inputUsername.toLowerCase();
};

// Pre-save hook to auto-increment studentNumber and update updatedAt
StudentSchema.pre("validate", async function (next) {
    if (this.isNew) {
        const filter = {
            roomNumber: this.roomNumber,
            messID: {
                hostelNumber: this.messID.hostelNumber,
                academicYear: this.messID.academicYear,
                academicSession: this.messID.academicSession,
            },
        };
        const update = { $inc: { seq: 1 } };
        const options = { new: true, upsert: true };

        const counter = await StudentCounter.findOneAndUpdate(filter, update, options);
        this.studentNumber = counter!.seq;
    }
    this.updatedAt = new Date();
    next();
});

const Student: Model<IStudent> = mongoose.model<IStudent>("Student", StudentSchema);

export default Student;

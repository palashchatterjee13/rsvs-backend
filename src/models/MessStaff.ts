import mongoose, { Schema, Model } from "mongoose";
import IMessStaff from "../interfaces/IMessStaff";
import Counter from "../interfaces/Counter";
import { MessIDSchema } from "./Mess";

const CounterSchema = new Schema<Counter>({
    messID: {
        hostelNumber: { type: Number, required: true },
        academicYear: { type: Number, required: true },
        academicSession: { type: String, required: true, lowercase: true },
    },
    seq: {
        type: Number,
        default: 0,
    },
});

const Counter = mongoose.model<Counter>("Counter", CounterSchema);

const MessStaffSchema = new Schema<IMessStaff>({
    staffNumber: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 128,
    },
    messID: {
        type: MessIDSchema,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 256,
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false,
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

// Composite unique index to enforce uniqueness across staffNumber and messID fields
MessStaffSchema.index({
    staffNumber: 1,
    "messID.hostelNumber": 1,
    "messID.academicYear": 1,
    "messID.academicSession": 1,
}, { unique: true });

// Virtual for username
MessStaffSchema.virtual("username").get(function (this: IMessStaff) {
    return `staff${this.staffNumber}.${this.messID.academicSession}.${this.messID.academicYear}@hostel${this.messID.hostelNumber}`;
});

// Instance method to validate username
MessStaffSchema.methods.validateUsername = function (this: IMessStaff, inputUsername: string) {
    return this.username === inputUsername;
};

// Pre-save hook to auto-increment staffNumber and update updatedAt
MessStaffSchema.pre("validate", async function (next) {
    if (this.isNew) {
        if (!this.messID) {
            return next(new Error("messID is required for auto-incrementing staffNumber"));
        }

        const filter = {
            "messID.hostelNumber": this.messID.hostelNumber,
            "messID.academicYear": this.messID.academicYear,
            "messID.academicSession": this.messID.academicSession,
        };

        const update = { $inc: { seq: 1 } };
        const options = { new: true, upsert: true };

        const counter = await Counter.findOneAndUpdate(filter, update, options);
        if (!counter) return next(new Error("Counter not found or failed to create"));

        this.staffNumber = counter.seq;

    }

    this.updatedAt = new Date();
    next();
});

const MessStaff: Model<IMessStaff> = mongoose.model<IMessStaff>("MessStaff", MessStaffSchema);

export default MessStaff;

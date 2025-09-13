import mongoose, { Schema, Model } from "mongoose";
import IMealClaim from "../interfaces/IMealClaim";
import { MessIDSchema } from "./Mess";

const MealClaimSchema = new Schema<IMealClaim>({
    messID: {
        type: MessIDSchema,
        required: true,
    },
    studentID: {
        type: String,
        ref: "Student",
        required: true,
    },
    mealType: {
        type: String,
        required: true,
        enum: ["breakfast", "lunch", "snacks", "dinner"],
        lowercase: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Number,
        required: true,
        immutable: true,
    },
    month: {
        type: String,
        lowercase: true,
        required: true,
        immutable: true,
    },
    year: {
        type: Number,
        required: true,
        immutable: true,
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

// Composite unique index across messId and other fields
MealClaimSchema.index({
    "messId.hostelNumber": 1,
    "messId.academicYear": 1,
    "messId.academicSession": 1,
    studentID: 1,
    date: 1,
    month: 1,
    year: 1,
    mealType: 1,
}, { unique: true });

// Pre-save hook to populate date, month, year from createdAt and update updatedAt
MealClaimSchema.pre("save", function (next) {
    const now = new Date();
    if (this.isNew) {
        this.date = now.getDate();
        this.month = now.toLocaleString("default", { month: "long" });
        this.year = now.getFullYear();
    }
    this.updatedAt = now;
    next();
});

// Instance method to mark verified as true
MealClaimSchema.methods.verify = function (this: IMealClaim) {
    this.verified = true;
    return this.save();
};

const MealClaim: Model<IMealClaim> = mongoose.model<IMealClaim>("MealClaim", MealClaimSchema);

export default MealClaim;

import mongoose, { Schema, Document, Model } from "mongoose";
import MessID from "../interfaces/MessID";
import Admin from "../interfaces/Admin";
import IMess from "../interfaces/IMess";

const MessIDSchema = new Schema<MessID>({
    hostelNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 32,
    },
    academicYear: {
        type: Number,
        required: true,
        min: 2025,
        max: 9999,
    },
    academicSession: {
        type: String,
        required: true,
        enum: ["monsoon", "spring"],
        lowercase: true,
    },
}, { _id: false });

const AdminSchema = new Schema<Admin>({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 128,
    },
    password: {
        type: String,
        required: true,
    },
}, { _id: false });

const MessSchema = new Schema<IMess>({
    messID: {
        type: MessIDSchema,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (this: IMess, value: Date) {
                return value.getFullYear() === this.messID.academicYear;
            },
            message: "Start date year must be the same as academic year",
        },
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (this: IMess, value: Date) {
                const year = value.getFullYear();
                return year === this.messID.academicYear || year === this.messID.academicYear + 1;
            },
            message: "End date year must be the same as academic year or academic year + 1",
        },
    },
    admin: {
        type: AdminSchema,
        required: true,
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

// Composite unique index across messID fields
MessSchema.index({
    "messID.hostelNumber": 1,
    "messID.academicSession": 1,
    "messID.academicYear": 1,
}, { unique: true });

// Virtual for uniqueID
MessSchema.virtual("uniqueID").get(function (this: IMess) {
    return `hostel-${this.messID.hostelNumber}-${this.messID.academicSession}-${this.messID.academicYear}`;
});

// Virtual for adminUsername
MessSchema.virtual("adminUsername").get(function (this: IMess) {
    return `admin.${this.messID.academicSession}.${this.messID.academicYear}@hostel${this.messID.hostelNumber}`;
});

// Instance methods
MessSchema.methods.changeStartDate = function (this: IMess, newStartDate: Date) {
    this.startDate = newStartDate;
    return this.save();
};

MessSchema.methods.changeEndDate = function (this: IMess, newEndDate: Date) {
    this.endDate = newEndDate;
    return this.save();
};

MessSchema.methods.changeAdminName = function (this: IMess, newName: string) {
    this.admin.name = newName;
    return this.save();
};

MessSchema.methods.changeAdminPassword = function (this: IMess, newPassword: string) {
    this.admin.password = newPassword;
    return this.save();
};

// Pre-save hook to update updatedAt timestamp
MessSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

const Mess: Model<IMess> = mongoose.model<IMess>("Mess", MessSchema);

export default Mess;
export { MessIDSchema, AdminSchema }

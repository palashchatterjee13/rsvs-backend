import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInCharge extends Document {
    username: string;
    password: string;
    validateUsername(inputUsername: string): boolean;
}

const InChargeSchema = new Schema<IInCharge>({
    username: {
        type: String,
        required: true,
        unique: true,
        default: "incharge@rsvs",
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 256,
    },
});

// Instance method to validate username
InChargeSchema.methods.validateUsername = function (this: IInCharge, inputUsername: string) {
    return this.username === inputUsername;
};

const InCharge: Model<IInCharge> = mongoose.model<IInCharge>("InCharge", InChargeSchema);

export default InCharge;

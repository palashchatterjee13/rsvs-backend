import { Document, Types } from "mongoose";
import IMessID from "./MessID";

export default interface IMealClaim extends Document {
    messID: IMessID;
    studentID: string;
    mealType: "breakfast" | "lunch" | "snacks" | "dinner";
    verified: boolean;
    date: number;
    month: string;
    year: number;
    createdAt: Date;
    updatedAt: Date;
    verify(): Promise<IMealClaim>;
}
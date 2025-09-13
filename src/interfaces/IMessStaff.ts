import { Document } from "mongoose";
import IMessID from "./MessID";

export default interface IMessStaff extends Document {
    staffNumber: number;
    name: string;
    messID: IMessID;
    password: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    validateUsername(inputUsername: string): boolean;
}
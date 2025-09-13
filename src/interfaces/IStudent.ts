import { Document, Types } from "mongoose";
import IMessID from "./MessID";

export default interface IStudent extends Document {
    studentNumber: number;
    roomNumber: number;
    messID: IMessID;
    name: string;
    rollNumber: string;
    phone: string;
    email: string;
    deleted: boolean;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    updateName(newName: string): Promise<IStudent>;
    updateRollNumber(newRollNumber: string): Promise<IStudent>;
    updatePhone(newPhone: string): Promise<IStudent>;
    updateEmail(newEmail: string): Promise<IStudent>;
    validateUsername(inputUsername: string): boolean;
}

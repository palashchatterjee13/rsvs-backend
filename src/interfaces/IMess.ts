import { Document } from "mongoose";
import MessID from "./MessID";
import Admin from "./Admin";

export default interface IMess extends Document {
    messID: MessID;
    startDate: Date;
    endDate: Date;
    admin: Admin;
    uniqueID: string;
    adminUsername: string;
    createdAt: Date;
    updatedAt: Date;
    changeStartDate(newStartDate: Date): Promise<IMess>;
    changeEndDate(newEndDate: Date): Promise<IMess>;
    changeAdminName(newName: string): Promise<IMess>;
    changeAdminPassword(newPassword: string): Promise<IMess>;
}
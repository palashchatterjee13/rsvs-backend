import { createHash } from "crypto";
import { Response } from "express";

const sha256 = (s: string): string => createHash('sha256').update(s).digest('hex');

const uniqueID = () => Date.now().toString(36) + Math.random().toString(36).slice(0, 12).replace(".", "");

const errorRes = (res: Response, { code, message, errors }: { code?: string, message?: string, errors?: {} }) => res.send({ status: "error", code: code, message: message, errors: (errors === undefined) ? {} : errors });
const successRes = (res: Response, { code, message, data }: { code?: string, message?: string, data?: any }) => res.send({ status: "success", code: code, message: message, data: (data === undefined) ? {} : data });

export { sha256, uniqueID, errorRes, successRes }
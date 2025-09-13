import verifyClaim from "../controllers/MessStaff/verifyClaim";
import messStaffLogin from "../controllers/MessStaff/login";
import authMessStaff from "../middlewares/authMessStaff";
import express from "express";

const messStaffRouter = express.Router();

messStaffRouter.post("/login", messStaffLogin);
messStaffRouter.post("/verify-claim", authMessStaff, verifyClaim);

export default messStaffRouter;

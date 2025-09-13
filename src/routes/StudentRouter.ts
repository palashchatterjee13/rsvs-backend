import profileCompleted from "../controllers/Student/profileCompleted";
import completeProfile from "../controllers/Student/completeProfile";
import claimMeal from "../controllers/Student/claimMeal";
import studentLogin from "../controllers/Student/login";
import authStudent from "../middlewares/authStudent";
import express from "express";

const studentRouter = express.Router();

studentRouter.post("/login", studentLogin);
studentRouter.post("/profile-completed", authStudent, profileCompleted);
studentRouter.post("/complete-profile", authStudent, completeProfile);
studentRouter.post("/claim-meal", authStudent, claimMeal);

export default studentRouter;

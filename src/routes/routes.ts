import messStaffRouter from "./MessStaffRouter";
import inChargeRouter from "./InChargeRouter";
import studentRouter from "./StudentRouter";
import adminRouter from "./AdminRouter";
import express from "express";

const router = express.Router()
router.use(express.json())

router.use('/mess-staff', messStaffRouter);
router.use('/incharge', inChargeRouter);
router.use('/student', studentRouter);
router.use('/admin', adminRouter);

export default router;
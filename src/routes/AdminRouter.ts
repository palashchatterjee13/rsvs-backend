import changeMessStaffPassword from "../controllers/Admin/changeMessStaffPassword";
import changeStudentPassword from "../controllers/Admin/changeStudentPassword";
import changeMessStaffName from "../controllers/Admin/changeMessStaffName";
import changeStudentName from "../controllers/Admin/changeStudentName";
import deleteMessStaff from "../controllers/Admin/deleteMessStaff";
import checkMessStaff from "../controllers/Admin/checkMessStaff";
import deleteStudent from "../controllers/Admin/deleteStudent";
import addMessStaff from "../controllers/Admin/addMessStaff";
import checkStudent from "../controllers/Admin/checkStudent";
import addStudent from "../controllers/Admin/addStudent";
import adminLogin from "../controllers/Admin/login";
import authAdmin from "../middlewares/authAdmin";
import express from "express";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);

adminRouter.post("/add-mess-staff", authAdmin, addMessStaff);
adminRouter.post("/check-mess-staff", authAdmin, checkMessStaff);
adminRouter.post("/delete-mess-staff", authAdmin, deleteMessStaff);
adminRouter.post("/change-mess-staff-name", authAdmin, changeMessStaffName);
adminRouter.post("/change-mess-staff-password", authAdmin, changeMessStaffPassword);


adminRouter.post("/add-student", authAdmin, addStudent);
adminRouter.post("/check-student", authAdmin, checkStudent);
adminRouter.post("/delete-student", authAdmin, deleteStudent);
adminRouter.post("/change-student-name", authAdmin, changeStudentName);
adminRouter.post("/change-student-password", authAdmin, changeStudentPassword);

export default adminRouter;

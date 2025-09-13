import changeAdminPassword from "../controllers/InCharge/changeAdminPassword";
import changeAdminName from "../controllers/InCharge/changeAdminName";
import authInCharge from "../middlewares/authInCharge";
import { login } from "../controllers/InCharge/login";
import addMess from "../controllers/InCharge/addMess";
import express from "express";
import viewMesses from "../controllers/InCharge/viewMesses";

const inChargeRouter = express.Router();

inChargeRouter.post("/login", login);
inChargeRouter.post("/add-mess", authInCharge, addMess);
inChargeRouter.post("/view-mess", authInCharge, viewMesses);
inChargeRouter.post("/change-admin-name", authInCharge, changeAdminName);
inChargeRouter.post("/change-admin-password", authInCharge, changeAdminPassword);

export default inChargeRouter;

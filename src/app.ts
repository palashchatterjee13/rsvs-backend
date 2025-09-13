import express, { Express, Request, Response } from "express";
import { MONGO_DB_CONNECTION_URL } from "./resources/values";
import { DEFAULT_PORT } from './resources/values';
import cookieParser from "cookie-parser";
import router from "./routes/routes";
import { connect } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

connect(MONGO_DB_CONNECTION_URL).then(() => {
  console.log("✅ MongoDB connected")
})

const app: Express = express();
const port = process.env.PORT || DEFAULT_PORT;

console.log(`\n\n\n✅ Express App Started (RSVS Backend)`)

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Resident Student Verification System (RSVS)");
});

app.use(cors({ origin: "https://palashchatterjee13.github.io/", credentials: true }));
app.use(cookieParser());
app.set("trust proxy", 1);

app.listen(port, () => {
  console.log(`ℹ️  [server]: Server is running at http://localhost:${port}`);
});

app.use("/public", express.static(path.join("", __dirname, "..", "storage")));

app.use("/api", router);


export default app;
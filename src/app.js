import express from "express";
import user from "./routes/user.js";
import auth from "./routes/auth.js";
import diary from "./routes/diary.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import dotenv from "dotenv";
dotenv.config();

export const app = express();

const customCors = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
};
app.use(customCors);

/*
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
*/
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", user);
app.use("/auth", auth);
app.use("/diary", diary);

const port = process.env.PORT || 3050;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

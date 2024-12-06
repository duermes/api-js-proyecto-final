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
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies(true));

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://www.duermes.me",
    "https://duermes.me",
    "http://localhost:3050",
    "https://api-js-proyecto.vercel.app",
    "https://js-proyecto-final.vercel.app",
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
    "Access-Control-Request-Headers",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  preflightContinue: false,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3050;

app.use("/auth", user);
app.use("/auth", auth);
app.use("/diary", diary);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

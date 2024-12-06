import express from "express";
import user from "./routes/user.js";
import auth from "./routes/auth.js";
import diary from "./routes/diary.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.options("*", cors());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://js-proyecto-final.vercel.app",
      "https://js-proyecto-final.vercel.app",
      "http://www.duermes.me",
      "https://www.duermes.me",
      "https://duermes.me",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
    exposedHeaders: ["Access-Control-Allow-Origin"],
  })
);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (
    (origin && origin.includes("duermes.me")) ||
    origin?.includes("js-proyecto-final.vercel.app") ||
    origin === "http://localhost:3000"
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3050;

app.use("/auth", user);
app.use("/auth", auth);
app.use("/diary", diary);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

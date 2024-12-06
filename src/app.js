import express from "express";
import user from "./routes/user.js";
import auth from "./routes/auth.js";
import diary from "./routes/diary.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

export const app = express();
app.options("https://www.duermes.me", cors());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://www.duermes.me",
      "https://duermes.me",
      "http://localhost:3050",
      "https://api-js-proyecto.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
    exposedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
  })
);
app.options("*", cors());

app.all("", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://www.duermes.me");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

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

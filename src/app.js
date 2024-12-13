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
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://www.duermes.me",
      "https://duermes.me",
      "http://localhost:3050",
      "https://api-js-proyecto.vercel.app",
      "https://js-proyecto-final.vercel.app",
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use("/auth", user);
app.use("/auth", auth);
app.use("/diary", diary);

const port = process.env.PORT || 3050;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

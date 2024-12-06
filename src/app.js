import express from "express";
import user from "./routes/user.js";
import auth from "./routes/auth.js";
import diary from "./routes/diary.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

export const app = express();
// Middleware to handle CORS preflight
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:3000",
    "https://www.duermes.me",
    "https://duermes.me",
    "http://localhost:3050",
    "https://api-js-proyecto.vercel.app",
  ];

  // Check if the origin is in our allowed origins list
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
  }

  next();
});

// Basic security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
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

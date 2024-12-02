import express from "express";
import user from "./routes/user.js";
import auth from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3050;

app.use("/auth", user);
app.use("/auth", auth);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

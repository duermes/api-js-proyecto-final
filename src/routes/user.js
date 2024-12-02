import express from "express";
import { newUser, login, getUser, logout } from "../controllers/user.js";

const router = express.Router();

router.post("/register", newUser);

router.post("/login", login);

router.get("/profile", getUser);

router.post("/logout", logout);

export default router;

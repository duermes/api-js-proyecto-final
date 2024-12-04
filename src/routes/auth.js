import express from "express";
import { requestReset, resetPassword } from "../controllers/auth.js";

const router = express.Router();

router.post("/reset-password/submit", resetPassword);

router.post("/reset-password/request", requestReset);

export default router;

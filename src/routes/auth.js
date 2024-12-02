import express from "express";
import { requestReset, resetPassword } from "../controllers/auth.js";

const router = express.Router();

router.post("/request-password/submit/:token", resetPassword);

router.post("/reset-password/request", requestReset);

export default router;

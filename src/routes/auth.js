import express from "express";

const router = express.Router();

router.post("/request-password/submit/:token", resetPassword);

router.post("/reset-password/submit", requestReset);

export default router;

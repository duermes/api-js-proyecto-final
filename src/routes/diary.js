import express from "express";
import {
  createEntry,
  deleteEntry,
  getEntries,
  updateEntry,
} from "../controllers/diary.js";

const router = express.Router();

router.get("/get-entries", getEntries);
router.post("/create-entry", createEntry);
router.put("/update-entry", updateEntry);
router.delete("/delete-entry", deleteEntry);

export default router;

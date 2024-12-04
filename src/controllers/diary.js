import { prisma } from "../db.js";
import jwt from "jsonwebtoken";

export async function getEntries(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(40).json({ message: "No autenticado" });
    }
    const session = jwt.verify(token, process.env.JWT_SECRET);

    const diaries = await prisma.diary.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    if (!diaries) {
      return res.status(400).json({ message: "Diarios no encontrados" });
    }

    const entriesInfo = {
      id: diary.id,
      title: diary.title,
      createdAt: diary.createdAt,
      content: diary.entries,
    };

    res.status(200).json(entriesInfo);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "¡Algo salió mal!" });
  }
}

export async function createEntry(req, res) {
  try {
    const { title, content, diaryId } = req.body;
    const diary = await prisma.diary.findUnique({
      where: { id: diaryId },
    });
    if (!diary) {
      return res.status(400).json({ message: "Diario no encontrado" });
    }
    const entry = await prisma.entry.create({
      data: {
        title,
        content,
        diaryId,
      },
    });
    res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
}

export async function updateEntry(req, res) {
  try {
    const { title, content, entryId } = req.body;
    const entry = await prisma.entry.findUnique({
      where: { id: entryId },
    });
    if (!entry) {
      return res.status(400).json({ message: "Entrada no encontrada" });
    }
    const updatedEntry = await prisma.entry.update({
      where: { id: entryId },
      data: {
        title,
        content,
      },
    });
    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
}

export async function deleteEntry(req, res) {
  try {
    const { entryId } = req.body;
    const entry = await prisma.entry.findUnique({
      where: { id: entryId },
    });
    if (!entry) {
      return res.status(400).json({ message: "Entrada no encontrada" });
    }
    await prisma.entry.delete({
      where: { id: entryId },
    });
    res.status(200).json({ message: "Entrada eliminada" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
}

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

    const entriesInfo = diaries.map((diary) => {
      return {
        id: diary.id,
        title: diary.title,
        content: diary.content,
        createdAt: diary.createdAt,
      };
    });

    if (!diaries) {
      return res.status(400).json({ message: "Diarios no encontrados" });
    }
    res.status(200).json(entriesInfo);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "¡Algo salió mal!" });
  }
}

export async function createEntry(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(40).json({ message: "No autenticado" });
    }
    const session = jwt.verify(token, process.env.JWT_SECRET);

    const { title, content } = req.body;

    const entry = await prisma.diary.create({
      data: {
        title,
        content,
        userId: session.userId,
      },
    });
    const entryInfo = {
      id: entry.id,
      title: entry.title,
      content: entry.content,
      createdAt: entry.createdAt,
    };
    res.status(200).json(entryInfo);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
}

export async function updateEntry(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(40).json({ message: "No autenticado" });
    }
    const session = jwt.verify(token, process.env.JWT_SECRET);

    const updatedEntry = await prisma.diary.update({
      where: { id: req.body.entryId, userId: session.userId },
      data: {
        title: req.body.title,
        content: req.body.content,
      },
    });

    const entryInfo = {
      id: updatedEntry.id,
      title: updatedEntry.title,
      content: updatedEntry.content,
    };
    res.status(200).json(entryInfo);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
}

export async function deleteEntry(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(40).json({ message: "No autenticado" });
    }
    const session = jwt.verify(token, process.env.JWT_SECRET);

    const { entryId } = req.body;
    const entry = await prisma.diary.findUnique({
      where: { id: entryId, userId: session.userId },
    });
    if (!entry) {
      return res.status(400).json({ message: "Entrada no encontrada" });
    }
    const deleted = await prisma.diary.delete({
      where: { id: entryId },
    });

    if (!deleted) {
      return res.status(400).json({ message: "Entrada no eliminada" });
    } else {
      res.status(200).json({ message: "Entrada eliminada" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
}

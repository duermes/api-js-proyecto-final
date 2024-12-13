import jwt from "jsonwebtoken";
import { prisma } from "../db.js";
import bcrypt from "bcrypt";

export async function newUser(req, res) {
  try {
    const userExists = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    if (!req.body.email.match(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi)) {
      return res.status(400).json({ message: "Correo electrónico inválido." });
    }

    if (
      !req.body.password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
      )
    ) {
      return res.status(400).json({
        message:
          "La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.",
      });
    }

    if (req.body.firstName.length > 20 || req.body.lastName.length > 20) {
      return res.status(400).json({
        message: "El nombre o apellido son demasiado largos.",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
    });

    res.res.status(200).json({ message: "¡Usuario creado exitosamente!" });
  } catch (error) {
    console.error("Error creating new user:", error);
    res.status(400).json({ message: "¡Algo salió mal!" });
  }
}

export async function login(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid || !user) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    if (user.isActive === false) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    const existingToken = req.cookies.token;
    let sessionId;

    if (existingToken) {
      try {
        const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);
        if (decoded.userId === user.id) {
          sessionId = existingToken;
        } else {
          sessionId = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "3h",
          });
        }
      } catch (error) {
        sessionId = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: "3h",
        });
      }
    } else {
      sessionId = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });
    }

    res
      .cookie("token", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3 * 60 * 60 * 1000,
      })
      .status(200)

      .json({ message: "¡Inicio de sesión exitoso!" });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(400).json({ message: "Error interno del servidor" });
  }
}

export async function getUser(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(40).json({ message: "No autenticado" });
    }

    const session = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      console.log("no se encontro al usuario");
    }

    const userInfo = {
      userId: session.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    res.status(200).json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "¡Algo salió mal!" });
  }
}

export async function logout(req, res) {
  res.clearCookie("token").status(200).json({ message: "¡Cerraste sesión!" });
}

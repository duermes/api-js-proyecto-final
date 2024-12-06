import crypto from "crypto";
import { prisma } from "../db.js";
import bcrypt from "bcrypt";
import { resetPasswordEmail } from "../emails/resetPassword.js";
import nodemailer from "nodemailer";
// import emailjs from "@emailjs/browser";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: " jeffry.flatley88@ethereal.email",
    pass: "K2xh56rhwZzBp7F8Tt",
  },
});

const noReplyEmail = "noreply@duermes.com";
// emailjs.init({
//   publicKey: process.env.EMAILJS_PUBLIC_KEY,
//   privateKey: process.env.EMAILJS_PRIVATE_KEY,
// });

function codeGenerator(length) {
  return crypto.randomBytes(length).toString("hex");
}

async function cleanExpiredTokens() {
  const now = new Date();
  const res = await prisma.token.deleteMany({
    where: {
      expiration: {
        lt: now,
      },
    },
  });
  console.log(`Response of cleanExpiredTokens ${res}`);
}

export async function requestReset(req, res) {
  try {
    cleanExpiredTokens();
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(400).json({ message: "¡Ingresa un email válido!" });
    }

    const existingToken = await prisma.token.findFirst({
      where: {
        userId: user.id,
        type: "PASSWORD",
      },
    });

    if (existingToken) {
      return res.status(200).json({
        message:
          "Ya tienes un reinicio de contraseña activo, ¡revisa tu correo o bandeja de spam!",
      });
    }

    const token = codeGenerator(50);
    console.log(token);
    await prisma.token.create({
      data: {
        userId: user.id,
        type: "PASSWORD",
        token: token,
        expiration: new Date(Date.now() + 1000 * 60 * 30),
      },
    });

    const domainURL = `${process.env.APP_URL}/reset-password/submit`;
    const resetLink = `${domainURL}?resetToken=${encodeURIComponent(token)}`;

    const emailContent = resetPasswordEmail
      .replace(/{{name}}/g, user.firstName)
      .replace(/{{link}}/g, resetLink);

    await transporter.sendMail({
      from: {
        name: "duermes",
        address: noReplyEmail,
      },
      to: "jeffry.flatley88@ethereal.email",
      subject: `Restablecer contraseña - ${user.firstName}`,
      html: emailContent,
    });

    // const email = await emailjs.send(
    //   "service_uwv3agh",
    //   "template_ffrzwpd",
    //   {
    //     name: user.firstName,
    //     link: resetLink,
    //     to_email: user.email,
    //   },
    //   {
    //     publicKey: process.env.EMAIL_JS_PUBLIC_KEY,
    //     privateKey: process.env.EMAIL_JS_PRIVATE_KEY,
    //   }
    // );

    // if (!email) {
    //   await prisma.token.delete({ where: { token: token } });
    //   return res.status(400).json({ message: "¡No se pudo enviar el correo!" });
    // }

    res.status(200).json({
      message:
        "Revisa tu bandeja de entrada para poder actualizar tu contraseña.",
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Internal Server Error" });
  }
}

export async function resetPassword(req, res) {
  try {
    const token = req.body.token;
    const password = req.body.password;

    let tokenData;
    const tokenRecord = await prisma.token.findUnique({
      where: { token: token },
    });
    if (tokenRecord) {
      tokenData = await prisma.token.delete({
        where: { id: tokenRecord.id },
      });
    } else {
      console.log("Token no encontrado");
      return res.status(400).json({
        message: "Token no encontrado o inválido, intenta de nuevo.",
      });
    }

    if (!tokenData || tokenData.expiration < new Date()) {
      return res.status(400).json({
        message: "Token no encontrado o inválido, intenta de nuevo.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`hashedPassword: ${hashedPassword}`);
    const user = await prisma.user.update({
      where: { id: tokenData.userId },
      data: {
        password: hashedPassword,
      },
    });
    if (user) {
      return res.status(200).json({ message: "¡Contraseña actualizada!" });
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Internal Server Error" });
  }
}

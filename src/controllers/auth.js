import crypto from "crypto";
import { prisma } from "../db.js";
import bcrypt from "bcrypt";
import emailjs from "@emailjs/browser";
import { env } from "process";

// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   auth: {
//     user: " jeffry.flatley88@ethereal.email",
//     pass: "K2xh56rhwZzBp7F8Tt",
//   },
// });

// const noReplyEmail = "noreply@duermes.com";
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
});

function codeGenerator(length) {
  return crypto.randomBytes(length).toString("hex");
}

export async function requestReset(req, res) {
  try {
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

    const domainURL = `https://localhost:${process.env.PORT}/reset-password/submit`;
    const resetLink = `${domainURL}?resetToken=${encodeURIComponent(token)}`;

    // const emailContent = resetPasswordEmail
    //   .replace(/{{name}}/g, user.firstName)
    //   .replace(/{{link}}/g, resetLink);

    // await transporter.sendMail({
    //   from: {
    //     name: "duermes",
    //     address: noReplyEmail,
    //   },
    //   to: user.email,
    //   subject: `Restablecer contraseña - ${user.firstName}`,
    //   html: emailContent,
    // });

    const email = await emailjs.send(
      "service_uwv3agh",
      "template_ffrzwpd",
      {
        name: user.firstName,
        link: resetLink,
        to_email: user.email,
      },
      {
        publicKey: env(EMAILJS_PUBLIC_KEY),
        privateKey: env(EMAILJS_PRIVATE_KEY),
      }
    );

    if (!email) {
      await prisma.token.delete({ where: { token: token } });
      return res.status(400).json({ message: "¡No se pudo enviar el correo!" });
    }

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
    const tokenData = await prisma.token.delete({
      where: { token: token },
    });

    if (!tokenData || tokenData.expiration < new Date()) {
      return res.status(400).json({
        message: "Token no encontrado o inválido, intenta de nuevo.",
      });
    }

    hashedPassword = bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.update({
      where: { id: tokenData.userId },
      data: {
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Internal Server Error" });
  }
}

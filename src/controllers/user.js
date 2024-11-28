import jwt from "jsonwebtoken";

export async function newUser(req, res) {
  try {
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
    });

    jwt.res.status(200).json({ message: "¡Usuario creado exitosamente!" });
  } catch (error) {
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

    const checkSession = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    let sessionId;
    if (!checkSession) {
      sessionId = jwt.sign({ sessionId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });
    } else {
      sessionId = checkSession;
    }
    res
      .status(200)
      .json({ message: "¡Inicio de sesión exitoso!" })
      .header("set-cookie", `token=${sessionId}; HttpOnly`);
  } catch (error) {
    res.status(400).json({ message: "¡Algo salió mal!" });
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
      where: { id: session.sessionId },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        sale: true,
      },
    });

    userInfo = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      sale: user.sale,
    };

    res.status(200).json(userInfo);
  } catch (error) {
    res.status(400).json({ message: "¡Algo salió mal!" });
  }
}

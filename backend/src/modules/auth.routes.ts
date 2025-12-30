// import { Router } from "express";
// import prisma from "../prisma.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const router = Router();

// router.post("/login", async (req, res) => {
//   // validate user with prisma
//   const user = await prisma.user.findUnique({ where: { email: req.body.email } });
//   if (!user) return res.status(401).json({ message: "Invalid credentials" });

//   const valid = await bcrypt.compare(req.body.password, user.passwordHash);
//   if (!valid) return res.status(401).json({ message: "Invalid credentials" });

//   const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });

//   // ✅ SET COOKIE
//   res.cookie("centre3_token", token, {
//     httpOnly: true,
//     secure: false,      // false for localhost HTTP
//     sameSite: "lax",    // "lax" works on localhost
//     maxAge: 24 * 60 * 60 * 1000,
//   });

//   return res.json({ success: true, user: { id: user.id, email: user.email } });
// });

// export default router;
import { Router, Request, Response } from "express";
import prisma from "../prisma.js";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

const router = Router();

/* ============================
   JWT PAYLOAD TYPE
============================ */
interface AuthTokenPayload extends JwtPayload {
  id: string;
  email: string;
}

/* ============================
   LOGIN
============================ */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.cookie("centre3_token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      path: "/",                 // 🔥 REQUIRED
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/* ============================
   AUTH CHECK (/me)
============================ */
router.get("/me", (req: Request, res: Response) => {
  const token = req.cookies?.centre3_token;

  if (!token) {
    return res.status(401).json({ success: false });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as AuthTokenPayload;

    return res.json({
      success: true,
      user: {
        id: decoded.id,
        email: decoded.email,
      },
    });
  } catch (err) {
    return res.status(401).json({ success: false });
  }
});

/* ============================
   LOGOUT (OPTIONAL BUT USEFUL)
============================ */
router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("centre3_token", {
    path: "/",
  });

  return res.json({ success: true });
});

export default router;

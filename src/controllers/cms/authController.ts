import { Request, Response } from "express";
import { prisma } from "../../config/db";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/generateToken";

export const loginUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    return res.status(400).json({
      message: "Username or email and password are required",
    });
  }

  // Find user by username or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token and set it in HTTP-only cookie
  const token = generateToken(user.id, res);

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    },
    message: "Login successful",
  });
};

export const logoutUser = async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ status: "success", message: "Logout successful" });
};

import jwt from "jsonwebtoken";
import { prisma } from "../config/db";
import { Request, Response, NextFunction } from "express";

interface AuthJwtPayload extends jwt.JwtPayload {
  id: string;
}

// Read the token from the request
// Check if toke is valid
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token and extract the user Id
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as AuthJwtPayload;
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "User is inactive" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

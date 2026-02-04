import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (userId: string, res: Response): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const payload = { id: userId };
  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  } as SignOptions;

  const token = jwt.sign(payload, secret, options);

  // Set token in HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    // sameSite: "strict",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return token;
};

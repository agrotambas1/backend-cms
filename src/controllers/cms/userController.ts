import { Request, Response } from "express";
import { prisma } from "../../config/db";
import bcrypt from "bcryptjs";

export const getUser = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const users = await prisma.user.findMany();
  res.json(users);
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, username, email, password, role } = req.body;

    // check if user already exists
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //   Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const { name, username, email, password, role, isActive } = req.body;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if username or email is already taken by another user
    if (username || email) {
      const duplicateUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [username ? { username } : {}, email ? { email } : {}].filter(
                (obj) => Object.keys(obj).length > 0
              ),
            },
          ],
        },
      });

      if (duplicateUser) {
        return res.status(400).json({
          message: "Username or email already taken by another user",
        });
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (typeof isActive === "boolean") updateData.isActive = isActive;

    // Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      status: "success",
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user?.id === id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    // Hard delete
    await prisma.user.delete({
      where: { id },
    });

    res.json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

import { Request, Response, NextFunction } from "express";

export type UserRole =
  | "ADMIN"
  | "MARKETING_EDITOR"
  | "TECHNICAL_EDITOR"
  | "VIEWER";

export const hasRole = (
  userRole: string,
  allowedRoles: UserRole[]
): boolean => {
  return allowedRoles.includes(userRole as UserRole);
};

export const checkRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!hasRole(req.user.role, allowedRoles)) {
      return res.status(403).json({
        message: "Forbidden: You don't have permission to access this resource",
        // requiredRoles: allowedRoles,
        // yourRole: req.user.role,
      });
    }

    next();
  };
};

// Admin only - Full access
export const adminOnly = checkRole("ADMIN");

// All editors (Marketing + Technical) - Can create/edit content
export const editorsOnly = checkRole(
  "ADMIN",
  "MARKETING_EDITOR",
  "TECHNICAL_EDITOR"
);

// Marketing Editor - Can create/edit/publish
export const marketingEditorAccess = checkRole("ADMIN", "MARKETING_EDITOR");

// Technical Editor - Can edit/approve
export const technicalEditorAccess = checkRole("ADMIN", "TECHNICAL_EDITOR");

// All authenticated users (including viewers)
export const authenticatedOnly = checkRole(
  "ADMIN",
  "MARKETING_EDITOR",
  "TECHNICAL_EDITOR",
  "VIEWER"
);

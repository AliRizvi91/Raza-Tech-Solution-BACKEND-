import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Response, NextFunction } from "express";
import { User_Model, IUser } from "../models/user";

dotenv.config();

// Extend Express Request type to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: IUser | null;
  }
}

interface DecodedToken extends JwtPayload {
  id: string;
  role?: string;
}

// Protect middleware (JWT authentication)
export const protect = async (req: any, res: Response, next: NextFunction) => {
let token: string | undefined;

if (
  req.headers.authorization &&
  req.headers.authorization.startsWith("Bearer")
) {
  try {
    token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(405).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as unknown as DecodedToken;

    req.user = await User_Model.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error: any) {
    console.error("Token verification failed:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(402).json({ message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired" });
    }
    return res.status(404).json({ message: "Not authorized" });
  }
} else {
  return res.status(405).json({ message: "Not authorized, no token" });
}

};

// Authorization Middleware (check if user is admin)
export const authorization = (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    if ((req.user as any).role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden, You are not authorized" });
    }

    next();
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

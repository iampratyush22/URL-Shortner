import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, "..", "keys", "public.key"),
  "utf8"
);

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token" });
  }

  const token = authHeader.split(" ")[1] || "";

  try {
    const payload = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    }) as jwt.JwtPayload;

    req.headers["x-user-id"] = payload.sub ?? "";

    next();
  } catch (err) {
    console.error("JWT VERIFY ERROR:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}

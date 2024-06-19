import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/User";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = typeof req.headers["token"] === "string" ? req.headers["token"] : "";
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, config.SECRET) as jwt.JwtPayload;
        if (!decoded || typeof decoded !== "object" || !decoded.id) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const { idUser1 } = req.body;
        if (!idUser1) {
            return res.status(403).json({ message: "No idUser provided" });
        }

        const user: any = await User.findById(idUser1);

        if (decoded.id !== user.password) {
            return res.status(401).json({ message: "Invalid token credentials" });
        }

        return next();
    } catch (error) {
        console.error("Error during token verification:", error);
        return res.status(401).json({ message: "Unauthorized", validate: false });
    }
};

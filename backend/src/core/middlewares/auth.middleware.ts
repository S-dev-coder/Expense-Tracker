import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../../modules/user/user.model.js";

interface JwtPayload {
    id: string;
}

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            throw new ApiError(401, "Not authorized to access this route");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as JwtPayload;

        const user = await User.findById(decoded.id);
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(401, "Not authorized to access this route"));
    }
};

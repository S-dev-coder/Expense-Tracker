import jwt from "jsonwebtoken";

export const generateToken = (id: string): string => {
    return jwt.sign({ id }, (process.env.JWT_SECRET || "fallback_secret") as jwt.Secret, {
        expiresIn: (process.env.JWT_EXPIRE || "30d") as jwt.SignOptions["expiresIn"],
    });
};

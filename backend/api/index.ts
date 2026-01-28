import type { Request, Response } from 'express';
import app from "../src/index.js";
import { connectDB } from "../src/core/config/database.js";

export default async function handler(req: Request, res: Response) {
    await connectDB();
    // @ts-ignore - Express app is compatible with Vercel handler
    return app(req, res);
}

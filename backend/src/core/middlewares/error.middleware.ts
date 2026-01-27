import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let { statusCode, message } = err;

    if (!(err instanceof ApiError)) {
        statusCode = err.statusCode || 500;
        message = err.message || "Internal Server Error";
    }

    const response = ApiResponse.error(message, statusCode);

    res.status(statusCode).json(response);
};

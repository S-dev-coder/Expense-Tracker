export class ApiError extends Error {
    public statusCode: number;
    public success: boolean;
    public isOperational: boolean;

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        isOperational: boolean = true,
        stack: string = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.isOperational = isOperational;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

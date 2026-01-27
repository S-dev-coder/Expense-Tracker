export class ApiResponse<T> {
    public success: boolean;
    public statusCode: number;
    public message: string;
    public data: T | null;

    constructor(statusCode: number, data: T | null = null, message: string = "Success") {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }

    static success<T>(data: T, message: string = "Success", statusCode: number = 200): ApiResponse<T> {
        return new ApiResponse(statusCode, data, message);
    }

    static error<T>(message: string = "Error", statusCode: number = 500, data: T | null = null): ApiResponse<T> {
        return new ApiResponse(statusCode, data, message);
    }
}

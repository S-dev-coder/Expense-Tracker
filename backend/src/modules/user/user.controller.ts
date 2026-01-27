import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";

export class UserController {
    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.service.register(req.body);
            res.status(201).json(ApiResponse.success(result, "User registered successfully", 201));
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const result = await this.service.login(email, password);
            res.status(200).json(ApiResponse.success(result, "Login successful"));
        } catch (error) {
            next(error);
        }
    };

    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            await this.service.forgotPassword(email);
            res.status(200).json(ApiResponse.success(null, "Password reset token sent to email"));
        } catch (error) {
            next(error);
        }
    };

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token, password } = req.body;
            await this.service.resetPassword(token, password);
            res.status(200).json(ApiResponse.success(null, "Password reset successful"));
        } catch (error) {
            next(error);
        }
    };

    getProfile = async (req: any, res: Response, next: NextFunction) => {
        try {
            const user = await this.service.getProfile(req.user.id);
            res.status(200).json(ApiResponse.success(user, "User profile fetched"));
        } catch (error) {
            next(error);
        }
    };

    updateProfile = async (req: any, res: Response, next: NextFunction) => {
        try {
            const user = await this.service.updateProfile(req.user.id, req.body);
            res.status(200).json(ApiResponse.success(user, "Profile updated successfully"));
        } catch (error) {
            next(error);
        }
    };

    deleteAccount = async (req: any, res: Response, next: NextFunction) => {
        try {
            await this.service.deleteAccount(req.user.id);
            res.status(200).json(ApiResponse.success(null, "Account deleted successfully"));
        } catch (error) {
            next(error);
        }
    };
}

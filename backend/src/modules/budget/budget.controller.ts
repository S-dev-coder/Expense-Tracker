import { Request, Response, NextFunction } from "express";
import { BudgetService } from "./budget.service.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";

export class BudgetController {
    private service: BudgetService;

    constructor() {
        this.service = new BudgetService();
    }

    setBudget = async (req: any, res: Response, next: NextFunction) => {
        try {
            const result = await this.service.setBudget(req.user.id, req.body);
            res.status(200).json(ApiResponse.success(result, "Budget set successfully"));
        } catch (error) {
            next(error);
        }
    };

    getBudget = async (req: any, res: Response, next: NextFunction) => {
        try {
            const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
            const year = parseInt(req.query.year as string) || new Date().getFullYear();
            const result = await this.service.getBudget(req.user.id, month, year);
            res.status(200).json(ApiResponse.success(result, "Budget fetched successfully"));
        } catch (error) {
            next(error);
        }
    };

    getStats = async (req: any, res: Response, next: NextFunction) => {
        try {
            const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
            const year = parseInt(req.query.year as string) || new Date().getFullYear();
            const result = await this.service.getBudgetStats(req.user.id, month, year);
            res.status(200).json(ApiResponse.success(result, "Budget stats fetched successfully"));
        } catch (error) {
            next(error);
        }
    };

    deleteBudget = async (req: any, res: Response, next: NextFunction) => {
        try {
            await this.service.deleteBudget(req.user.id, req.params.id);
            res.status(200).json(ApiResponse.success(null, "Budget deleted successfully"));
        } catch (error) {
            next(error);
        }
    };
}

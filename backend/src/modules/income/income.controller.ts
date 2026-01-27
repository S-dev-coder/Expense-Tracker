import { Request, Response, NextFunction } from "express";
import { IncomeService } from "./income.service.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";

export class IncomeController {
    private service: IncomeService;

    constructor() {
        this.service = new IncomeService();
    }

    create = async (req: any, res: Response, next: NextFunction) => {
        try {
            const income = await this.service.create(req.user.id, req.body);
            res.status(201).json(ApiResponse.success(income, "Income added successfully", 201));
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: any, res: Response, next: NextFunction) => {
        try {
            const incomes = await this.service.getAll(req.user.id, req.query);
            res.status(200).json(ApiResponse.success(incomes, "Incomes fetched successfully"));
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: any, res: Response, next: NextFunction) => {
        try {
            const income = await this.service.getById(req.user.id, req.params.id);
            res.status(200).json(ApiResponse.success(income, "Income details fetched"));
        } catch (error) {
            next(error);
        }
    };

    update = async (req: any, res: Response, next: NextFunction) => {
        try {
            const income = await this.service.update(req.user.id, req.params.id, req.body);
            res.status(200).json(ApiResponse.success(income, "Income updated successfully"));
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: any, res: Response, next: NextFunction) => {
        try {
            await this.service.delete(req.user.id, req.params.id);
            res.status(200).json(ApiResponse.success(null, "Income deleted successfully"));
        } catch (error) {
            next(error);
        }
    };
}

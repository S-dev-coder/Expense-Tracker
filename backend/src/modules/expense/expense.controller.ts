import { Request, Response, NextFunction } from "express";
import { ExpenseService } from "./expense.service.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";

export class ExpenseController {
    private service: ExpenseService;

    constructor() {
        this.service = new ExpenseService();
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const expenses = await this.service.getAllExpenses();
            res.status(200).json(ApiResponse.success(expenses, "Expenses fetched successfully"));
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const expense = await this.service.createExpense(req.body);
            res.status(201).json(ApiResponse.success(expense, "Expense created successfully", 201));
        } catch (error) {
            next(error);
        }
    };
}

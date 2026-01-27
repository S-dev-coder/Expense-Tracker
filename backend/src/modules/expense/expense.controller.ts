import { Request, Response, NextFunction } from "express";
import { ExpenseService } from "./expense.service.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";

export class ExpenseController {
    private service: ExpenseService;

    constructor() {
        this.service = new ExpenseService();
    }

    create = async (req: any, res: Response, next: NextFunction) => {
        try {
            const data = { ...req.body };
            if (req.file) {
                data.receiptUrl = `/uploads/receipts/${req.file.filename}`;
            }
            // Parse tags if they come as a string
            if (data.tags && typeof data.tags === "string") {
                data.tags = data.tags.split(",").map((t: string) => t.trim());
            }

            // Sanitize categoryId
            if (data.categoryId === "" || data.categoryId === "undefined") {
                delete data.categoryId;
            }

            const expense = await this.service.create(req.user.id, data);
            res.status(201).json(ApiResponse.success(expense, "Expense added successfully", 201));
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: any, res: Response, next: NextFunction) => {
        try {
            const expenses = await this.service.getAll(req.user.id, req.query);
            res.status(200).json(ApiResponse.success(expenses, "Expenses fetched successfully"));
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: any, res: Response, next: NextFunction) => {
        try {
            const expense = await this.service.getById(req.user.id, req.params.id);
            res.status(200).json(ApiResponse.success(expense, "Expense details fetched"));
        } catch (error) {
            next(error);
        }
    };

    update = async (req: any, res: Response, next: NextFunction) => {
        try {
            const data = { ...req.body };
            if (req.file) {
                data.receiptUrl = `/uploads/receipts/${req.file.filename}`;
            }
            // Parse tags if they come as a string
            if (data.tags && typeof data.tags === "string") {
                data.tags = data.tags.split(",").map((t: string) => t.trim());
            }

            // Sanitize categoryId
            if (data.categoryId === "" || data.categoryId === "undefined") {
                delete data.categoryId;
            }

            const expense = await this.service.update(req.user.id, req.params.id, data);
            res.status(200).json(ApiResponse.success(expense, "Expense updated successfully"));
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: any, res: Response, next: NextFunction) => {
        try {
            console.log(`Deleting expense ${req.params.id} for user ${req.user.id}`);
            await this.service.delete(req.user.id, req.params.id);
            res.status(200).json(ApiResponse.success(null, "Expense deleted successfully"));
        } catch (error) {
            next(error);
        }
    };

    bulkDelete = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { ids } = req.body;
            const count = await this.service.bulkDelete(req.user.id, ids);
            res.status(200).json(ApiResponse.success({ count }, `${count} expenses deleted`));
        } catch (error) {
            next(error);
        }
    };
}

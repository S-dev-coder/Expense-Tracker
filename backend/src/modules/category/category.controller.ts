import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";

export class CategoryController {
    private service: CategoryService;

    constructor() {
        this.service = new CategoryService();
    }

    create = async (req: any, res: Response, next: NextFunction) => {
        try {
            const result = await this.service.create(req.user.id, req.body);
            res.status(201).json(ApiResponse.success(result, "Category created successfully", 201));
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: any, res: Response, next: NextFunction) => {
        try {
            const result = await this.service.getAll(req.user.id);
            res.status(200).json(ApiResponse.success(result, "Categories fetched successfully"));
        } catch (error) {
            next(error);
        }
    };

    update = async (req: any, res: Response, next: NextFunction) => {
        try {
            const result = await this.service.update(req.user.id, req.params.id, req.body);
            res.status(200).json(ApiResponse.success(result, "Category updated successfully"));
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: any, res: Response, next: NextFunction) => {
        try {
            await this.service.delete(req.user.id, req.params.id);
            res.status(200).json(ApiResponse.success(null, "Category deleted successfully"));
        } catch (error) {
            next(error);
        }
    };
}

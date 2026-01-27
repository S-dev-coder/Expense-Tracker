import { CategoryRepository } from "./category.repository.js";
import { ICategory } from "./category.interface.js";
import { ApiError } from "../../core/utils/ApiError.js";

export class CategoryService {
    private repository: CategoryRepository;

    constructor() {
        this.repository = new CategoryRepository();
    }

    async create(userId: string, data: Partial<ICategory>) {
        return await this.repository.create({ ...data, userId } as any);
    }

    async getAll(userId: string) {
        return await this.repository.findByUser(userId);
    }

    async update(userId: string, categoryId: string, data: Partial<ICategory>) {
        const category = await this.repository.findById(categoryId);
        if (!category) throw new ApiError(404, "Category not found");
        if (category.userId && category.userId.toString() !== userId) {
            throw new ApiError(403, "You don't have permission to update this category");
        }
        return await this.repository.update(categoryId, data);
    }

    async delete(userId: string, categoryId: string) {
        const category = await this.repository.findById(categoryId);
        if (!category) throw new ApiError(404, "Category not found");
        if (category.userId && category.userId.toString() !== userId) {
            throw new ApiError(403, "You don't have permission to delete this category");
        }
        if (!category.userId) {
            throw new ApiError(403, "Cannot delete default system categories");
        }
        return await this.repository.delete(categoryId);
    }
}

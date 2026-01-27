import { ExpenseRepository } from "./expense.repository.js";
import { IExpense } from "./expense.interface.js";
import { ApiError } from "../../core/utils/ApiError.js";

export class ExpenseService {
    private repository: ExpenseRepository;

    constructor() {
        this.repository = new ExpenseRepository();
    }

    async create(userId: string, data: Partial<IExpense>) {
        return await this.repository.create({ ...data, userId } as any);
    }

    async getAll(userId: string, filters: any = {}) {
        const { startDate, endDate, category, paymentMethod, minAmount, maxAmount, tags, search, sortBy = "date", order = "desc" } = filters;

        const query: any = { userId };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        if (category) query.category = category;
        if (paymentMethod) query.paymentMethod = paymentMethod;

        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount) query.amount.$gte = Number(minAmount);
            if (maxAmount) query.amount.$lte = Number(maxAmount);
        }

        if (tags) {
            const tagsArray = Array.isArray(tags) ? tags : tags.split(",");
            query.tags = { $in: tagsArray };
        }

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        const options: any = {};
        options[sortBy] = order === "asc" ? 1 : -1;

        // Since BaseRepository findAll doesn't support complex options yet, we'll use find directly for sorting
        // Or we could update BaseRepository. For now, let's just do it here or update BaseRepository.
        // Let's stick to the repository pattern.
        return await (this.repository as any).model.find(query).sort(options).exec();
    }

    async getById(userId: string, id: string) {
        const expense = await this.repository.findOne({ _id: id, userId });
        if (!expense) throw new ApiError(404, "Expense not found");
        return expense;
    }

    async update(userId: string, id: string, data: Partial<IExpense>) {
        const expense = await this.repository.findOne({ _id: id, userId });
        if (!expense) {
            throw new ApiError(404, "Expense not found or unauthorized");
        }
        return await this.repository.update(id, data);
    }

    async delete(userId: string, id: string) {
        const expense = await this.repository.findOne({ _id: id, userId });
        if (!expense) throw new ApiError(404, "Expense not found");
        return await this.repository.delete(id);
    }

    async bulkDelete(userId: string, ids: string[]) {
        const result = await (this.repository as any).model.deleteMany({
            _id: { $in: ids },
            userId
        });
        return result.deletedCount;
    }
}

import { IncomeRepository } from "./income.repository.js";
import { IIncome } from "./income.interface.js";
import { ApiError } from "../../core/utils/ApiError.js";

export class IncomeService {
    private repository: IncomeRepository;

    constructor() {
        this.repository = new IncomeRepository();
    }

    /**
     * Create a new income record for a specific user.
     * @param userId Authenticated user ID
     * @param data Initial income data
     */
    async create(userId: string, data: Partial<IIncome>) {
        return await this.repository.create({ ...data, userId } as any);
    }

    /**
     * Retrieve all income records for a user with optional filtering.
     * Supports search by title, category filter, and date range filtering.
     * @param userId Authenticated user ID
     * @param filters Filtering and sorting options
     */
    async getAll(userId: string, filters: any = {}) {
        const { startDate, endDate, category, search, sortBy = "date", order = "desc" } = filters;

        const query: any = { userId };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        if (category) query.category = category;

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        const options: any = {};
        options[sortBy] = order === "asc" ? 1 : -1;

        return await (this.repository as any).model.find(query).sort(options).exec();
    }

    /**
     * Get a specific income record by ID, ensuring it belongs to the requesting user.
     * @param userId Authenticated user ID
     * @param id Income record ID
     */
    async getById(userId: string, id: string) {
        const income = await this.repository.findOne({ _id: id, userId });
        if (!income) throw new ApiError(404, "Income not found");
        return income;
    }

    /**
     * Update an existing income record.
     * Includes basic authorization check to ensure user ownership.
     * @param userId Authenticated user ID
     * @param id Income record ID
     * @param data Updated fields
     */
    async update(userId: string, id: string, data: Partial<IIncome>) {
        const income = await this.repository.update(id, data);
        if (!income || income.userId.toString() !== userId) {
            throw new ApiError(404, "Income not found or unauthorized");
        }
        return income;
    }

    /**
     * Delete an income record.
     * @param userId Authenticated user ID
     * @param id Income record ID
     */
    async delete(userId: string, id: string) {
        const income = await this.repository.findOne({ _id: id, userId });
        if (!income) throw new ApiError(404, "Income not found");
        return await this.repository.delete(id);
    }
}

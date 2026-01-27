import { IncomeRepository } from "./income.repository.js";
import { IIncome } from "./income.interface.js";
import { ApiError } from "../../core/utils/ApiError.js";

export class IncomeService {
    private repository: IncomeRepository;

    constructor() {
        this.repository = new IncomeRepository();
    }

    async create(userId: string, data: Partial<IIncome>) {
        return await this.repository.create({ ...data, userId } as any);
    }

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

    async getById(userId: string, id: string) {
        const income = await this.repository.findOne({ _id: id, userId });
        if (!income) throw new ApiError(404, "Income not found");
        return income;
    }

    async update(userId: string, id: string, data: Partial<IIncome>) {
        const income = await this.repository.update(id, data);
        if (!income || income.userId.toString() !== userId) {
            throw new ApiError(404, "Income not found or unauthorized");
        }
        return income;
    }

    async delete(userId: string, id: string) {
        const income = await this.repository.findOne({ _id: id, userId });
        if (!income) throw new ApiError(404, "Income not found");
        return await this.repository.delete(id);
    }
}

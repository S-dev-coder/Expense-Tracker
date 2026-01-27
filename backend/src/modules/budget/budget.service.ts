import { BudgetRepository } from "./budget.repository.js";
import { IBudget } from "./budget.interface.js";
import { ApiError } from "../../core/utils/ApiError.js";
import { Expense } from "../expense/expense.model.js";
import { Income } from "../income/income.model.js";

export class BudgetService {
    private repository: BudgetRepository;

    constructor() {
        this.repository = new BudgetRepository();
    }

    async setBudget(userId: string, data: Partial<IBudget>) {
        const { month, year } = data;
        const existingBudget = await this.repository.findByUserAndMonth(userId, month!, year!);

        if (existingBudget) {
            return await this.repository.update(existingBudget.id, data);
        } else {
            return await this.repository.create({ ...data, userId } as any);
        }
    }

    async getBudget(userId: string, month: number, year: number) {
        return await this.repository.findByUserAndMonth(userId, month, year);
    }

    async deleteBudget(userId: string, budgetId: string) {
        const budget = await this.repository.findById(budgetId);
        if (!budget) throw new ApiError(404, "Budget not found");
        if (budget.userId.toString() !== userId) {
            throw new ApiError(403, "Forbidden");
        }
        return await this.repository.delete(budgetId);
    }

    async getBudgetStats(userId: string, month: number, year: number) {
        const budget = await this.getBudget(userId, month, year);
        if (!budget) return null;

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const [expenses, incomes] = await Promise.all([
            Expense.find({
                userId,
                date: { $gte: startDate, $lte: endDate }
            }),
            Income.find({
                userId,
                date: { $gte: startDate, $lte: endDate }
            })
        ]);

        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

        const categorySpending: Record<string, number> = {};
        expenses.forEach((exp: any) => {
            const catId = exp.categoryId?.toString() || exp.category;
            categorySpending[catId] = (categorySpending[catId] || 0) + exp.amount;
        });

        const stats = {
            totalLimit: budget.totalLimit,
            totalSpent,
            totalIncome,
            percentage: (totalSpent / budget.totalLimit) * 100,
            incomeUsagePercentage: (budget.totalLimit / (totalIncome || 1)) * 100,
            categories: budget.categoryLimits.map(limit => {
                const spent = categorySpending[limit.categoryId.toString()] || 0;
                return {
                    categoryId: limit.categoryId,
                    name: "", // Will be filled in controller or via populate
                    limit: limit.limit,
                    spent,
                    percentage: (spent / limit.limit) * 100
                };
            })
        };

        return stats;
    }
}

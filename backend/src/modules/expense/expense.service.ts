import { ExpenseRepository } from "./expense.repository.js";
import { IExpense } from "./expense.interface.js";

export class ExpenseService {
    private repository: ExpenseRepository;

    constructor() {
        this.repository = new ExpenseRepository();
    }

    async getAllExpenses(): Promise<IExpense[]> {
        return this.repository.findAll();
    }

    async createExpense(expense: IExpense): Promise<IExpense> {
        return this.repository.create(expense);
    }
}

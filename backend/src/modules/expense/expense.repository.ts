import { BaseRepository } from "../../core/base/BaseRepository.js";
import { IExpense } from "./expense.interface.js";
import { Expense } from "./expense.model.js";

export class ExpenseRepository extends BaseRepository<IExpense> {
    constructor() {
        super(Expense);
    }
    // Add specific expense database methods here
}

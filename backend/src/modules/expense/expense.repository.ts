import { BaseRepository } from "../../core/base/BaseRepository.js";
import { IExpenseDocument, Expense } from "./expense.model.js";

export class ExpenseRepository extends BaseRepository<IExpenseDocument> {
    constructor() {
        super(Expense);
    }
}

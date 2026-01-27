import { BaseRepository } from "../../core/base/BaseRepository.js";
import { IBudgetDocument, Budget } from "./budget.model.js";

export class BudgetRepository extends BaseRepository<IBudgetDocument> {
    constructor() {
        super(Budget);
    }

    async findByUserAndMonth(userId: string, month: number, year: number): Promise<IBudgetDocument | null> {
        return await this.model.findOne({ userId, month, year }).exec();
    }
}

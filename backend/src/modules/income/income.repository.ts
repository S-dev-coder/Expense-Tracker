import { BaseRepository } from "../../core/base/BaseRepository.js";
import { IIncomeDocument, Income } from "./income.model.js";

export class IncomeRepository extends BaseRepository<IIncomeDocument> {
    constructor() {
        super(Income);
    }
}

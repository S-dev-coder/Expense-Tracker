import { BaseRepository } from "../../core/base/BaseRepository.js";
import { ICategoryDocument, Category } from "./category.model.js";

export class CategoryRepository extends BaseRepository<ICategoryDocument> {
    constructor() {
        super(Category);
    }

    async findByUser(userId: string): Promise<ICategoryDocument[]> {
        return await this.model.find({
            $or: [
                { userId: userId },
                { userId: null } // Include default system categories
            ]
        }).exec();
    }
}

import { BaseRepository } from "../../core/base/BaseRepository.js";
import { IUserDocument, User } from "./user.model.js";

export class UserRepository extends BaseRepository<IUserDocument> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<IUserDocument | null> {
        return await User.findOne({ email }).select("+password").exec();
    }
}

import { UserRepository } from "./user.repository.js";
import { IUser } from "./user.interface.js";
import { ApiError } from "../../core/utils/ApiError.js";
import { generateToken } from "../../core/utils/jwt.utils.js";

export class UserService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    async register(userData: IUser) {
        const existingUser = await this.repository.findByEmail(userData.email);
        if (existingUser) {
            throw new ApiError(400, "User already exists with this email");
        }

        const user = await this.repository.create(userData as any);
        const token = generateToken(user._id as any);

        return { user, token };
    }

    async login(email: string, password: string) {
        const user = await this.repository.findByEmail(email);
        if (!user) {
            throw new ApiError(401, "Invalid credentials");
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new ApiError(401, "Invalid credentials");
        }

        const token = generateToken(user._id as any);

        return { user, token };
    }

    async getProfile(userId: string) {
        const user = await this.repository.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return user;
    }

    async updateProfile(userId: string, updateData: Partial<IUser>) {
        const user = await this.repository.update(userId, updateData);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return user;
    }

    async forgotPassword(email: string) {
        const user = await this.repository.findByEmail(email);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Generate reset token (simple for demo, use crypto in production)
        const resetToken = Math.random().toString(36).substring(2, 12);
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await user.save();

        console.log(`Password reset token for ${email}: ${resetToken}`);
        // In a real app, send email here
        return resetToken;
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await (this.repository as any).model.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            throw new ApiError(400, "Invalid or expired reset token");
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        return true;
    }

    async deleteAccount(userId: string) {
        const deleted = await this.repository.delete(userId);
        if (!deleted) {
            throw new ApiError(404, "User not found");
        }
        return true;
    }
}

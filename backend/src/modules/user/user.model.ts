import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "./user.interface.js";

export interface IUserDocument extends IUser, Document {
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true, select: false },
        preferences: {
            currency: { type: String, default: "USD" },
            timezone: { type: String, default: "UTC" },
            theme: { type: String, enum: ["light", "dark"], default: "light" },
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret: any) => {
                delete ret.password;
                delete ret.__v;
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

// Hash password before saving
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUserDocument>("User", UserSchema);

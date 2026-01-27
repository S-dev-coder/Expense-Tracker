import mongoose, { Schema, Document } from "mongoose";
import { IIncome } from "./income.interface.js";

export interface IIncomeDocument extends IIncome, Document { }

const IncomeSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        category: {
            type: String,
            required: true,
            enum: ["Salary", "Freelance", "Investment", "Gift", "Other"]
        },
        date: { type: Date, required: true },
        description: { type: String },
        tags: [{ type: String }],
    },
    {
        toJSON: {
            transform: (_, ret: any) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
        timestamps: true,
    }
);

IncomeSchema.index({ userId: 1, date: -1 });

export const Income = mongoose.model<IIncomeDocument>("Income", IncomeSchema);

import mongoose, { Schema, Document } from "mongoose";
import { IBudget } from "./budget.interface.js";

export interface IBudgetDocument extends IBudget, Document { }

const BudgetSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        totalLimit: { type: Number, required: true },
        categoryLimits: [
            {
                categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
                limit: { type: Number, required: true },
            },
        ],
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

BudgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

export const Budget = mongoose.model<IBudgetDocument>("Budget", BudgetSchema);

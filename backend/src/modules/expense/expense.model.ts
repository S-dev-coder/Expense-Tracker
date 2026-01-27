import mongoose, { Schema, Document } from "mongoose";
import { IExpense } from "./expense.interface.js";

export interface IExpenseDocument extends IExpense, Document { }

const ExpenseSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        category: { type: String, required: true },
        date: { type: String, required: true },
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

export const Expense = mongoose.model<IExpenseDocument>("Expense", ExpenseSchema);

import mongoose, { Schema, Document } from "mongoose";
import { IExpense } from "./expense.interface.js";

export interface IExpenseDocument extends IExpense, Document { }

const ExpenseSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        category: { type: String, required: true },
        categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
        date: { type: Date, required: true },
        paymentMethod: {
            type: String,
            required: true,
            enum: ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"]
        },
        description: { type: String },
        receiptUrl: { type: String },
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

// Index for faster searching
ExpenseSchema.index({ userId: 1, date: -1 });
ExpenseSchema.index({ tags: 1 });

export const Expense = mongoose.model<IExpenseDocument>("Expense", ExpenseSchema);

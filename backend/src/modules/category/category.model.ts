import mongoose, { Schema, Document } from "mongoose";
import { ICategory } from "./category.interface.js";

export interface ICategoryDocument extends ICategory, Document { }

const CategorySchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
        name: { type: String, required: true },
        icon: { type: String, required: true },
        color: { type: String, required: true },
        budgetLimit: { type: Number, default: 0 },
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

CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

export const Category = mongoose.model<ICategoryDocument>("Category", CategorySchema);

import { Model, UpdateQuery } from "mongoose";

export interface IBaseRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(item: T): Promise<T>;
    update(id: string, item: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async findAll(filter: any = {}): Promise<T[]> {
        return await this.model.find(filter).exec();
    }

    async findOne(filter: any): Promise<T | null> {
        return await this.model.findOne(filter).exec();
    }

    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id).exec();
    }

    async create(item: T): Promise<T> {
        const createdItem = new this.model(item);
        return await createdItem.save() as T;
    }

    async update(id: string, item: Partial<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(
            id,
            item as UpdateQuery<T>,
            { new: true }
        ).exec();
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id).exec();
        return result !== null;
    }
}

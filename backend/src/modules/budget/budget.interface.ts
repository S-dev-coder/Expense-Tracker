export interface IBudget {
    id: string;
    userId: string;
    month: number;
    year: number;
    totalLimit: number;
    categoryLimits: {
        categoryId: string;
        limit: number;
    }[];
}

export interface ICategory {
    id: string;
    userId: string | null; // null for system/default categories
    name: string;
    icon: string;
    color: string;
    budgetLimit?: number;
}

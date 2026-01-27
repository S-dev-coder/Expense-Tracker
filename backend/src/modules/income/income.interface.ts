export interface IIncome {
    id: string;
    userId: string;
    title: string;
    amount: number;
    category: "Salary" | "Freelance" | "Investment" | "Gift" | "Other";
    date: Date;
    description?: string;
    tags?: string[];
}

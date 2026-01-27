export type PaymentMethod = "Cash" | "Credit Card" | "Debit Card" | "UPI" | "Net Banking";

export interface IExpense {
    id: string;
    userId: string;
    title: string;
    amount: number;
    category: string;
    categoryId?: string;
    date: Date;
    paymentMethod: PaymentMethod;
    description?: string;
    receiptUrl?: string;
    tags?: string[];
}

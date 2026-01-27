export type PaymentMethod = "Cash" | "Credit Card" | "Debit Card" | "UPI" | "Net Banking";

export interface IExpense {
    id: string;
    userId: string;
    title: string;
    amount: number;
    category: "Food" | "Transport" | "Shopping" | "Bills" | "Entertainment" | "Health" | "Education" | "Other";
    date: Date;
    paymentMethod: PaymentMethod;
    description?: string;
    receiptUrl?: string;
    tags?: string[];
}

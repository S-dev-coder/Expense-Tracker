export const currencyMap: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    CNY: "¥",
    AED: "د.إ",
    SGD: "S$",
};

export const getCurrencySymbol = (currencyCode: string = "USD"): string => {
    return currencyMap[currencyCode] || "$";
};

export const formatCurrency = (amount: number, currencyCode: string = "USD"): string => {
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

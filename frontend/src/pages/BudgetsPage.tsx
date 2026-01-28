import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../lib/currencyUtils";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Loader2, Save, PieChart, Target, AlertTriangle } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { LayoutWrapper } from "../components/ui/LayoutWrapper";

interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
}

interface Budget {
    id?: string;
    totalLimit: number;
    categoryLimits: { categoryId: string; limit: number }[];
}

const BudgetsPage: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [budget, setBudget] = useState<Budget>({
        totalLimit: 0,
        categoryLimits: [],
    });
    const [totalIncome, setTotalIncome] = useState(0);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const fetchData = async () => {
        setLoading(true);
        try {
            const [catRes, budgetRes, statsRes] = await Promise.all([
                api.get("/categories"),
                api.get(`/budgets?month=${month}&year=${year}`),
                api.get(`/budgets/stats?month=${month}&year=${year}`),
            ]);
            setCategories(catRes.data.data);
            if (budgetRes.data.data) {
                setBudget(budgetRes.data.data);
            } else {
                setBudget({ totalLimit: 0, categoryLimits: [] });
            }
            setTotalIncome(statsRes.data.data?.totalIncome || 0);
        } catch (error) {
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [month, year]);

    const handleSave = async () => {
        if (budget.totalLimit > totalIncome) {
            toast.error(`Budget cannot exceed total income (${formatCurrency(totalIncome)})`);
            return;
        }
        setLoading(true);
        try {
            await api.post("/budgets", { ...budget, month, year });
            toast.success("Budget saved successfully!");
        } catch (error) {
            toast.error("Failed to save budget");
        } finally {
            setLoading(false);
        }
    };

    const updateCategoryLimit = (categoryId: string, limit: number) => {
        const existing = budget.categoryLimits.find(l => l.categoryId === categoryId);
        let newLimits;
        if (existing) {
            newLimits = budget.categoryLimits.map(l => l.categoryId === categoryId ? { ...l, limit } : l);
        } else {
            newLimits = [...budget.categoryLimits, { categoryId, limit }];
        }
        setBudget({ ...budget, categoryLimits: newLimits });
    };

    const getCategoryLimit = (categoryId: string) => {
        return budget.categoryLimits.find(l => l.categoryId === categoryId)?.limit || 0;
    };

    if (loading && categories.length === 0) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <PageHeader
                title="Monthly Budget"
                description={`Plan your spending for ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}.`}
                action={
                    <div className="flex items-center gap-3">
                        <select
                            value={month}
                            onChange={(e) => setMonth(parseInt(e.target.value))}
                            className="bg-card border rounded-xl px-4 h-11 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                            ))}
                        </select>
                        <select
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="bg-card border rounded-xl px-4 h-11 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                }
            />

            <LayoutWrapper columns={2}>
                {/* Total Budget Setting */}
                <div className="space-y-6">
                    <div className="p-8 bg-primary text-primary-foreground rounded-[2.5rem] shadow-2xl shadow-primary/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Target className="w-16 h-16" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Overall Limit</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black">{formatCurrency(budget.totalLimit, user?.preferences?.currency)}</span>
                            </div>
                            <div className="pt-4">
                                <label className="text-xs font-bold mb-2 block opacity-70">Set New Limit</label>
                                <input
                                    type="number"
                                    value={budget.totalLimit}
                                    onChange={(e) => setBudget({ ...budget, totalLimit: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 h-12 text-xl font-black focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/30"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="pt-2 flex items-center justify-between opacity-70">
                                <p className="text-[10px] font-bold uppercase tracking-widest">Available Income</p>
                                <p className="text-sm font-bold">{formatCurrency(totalIncome, user?.preferences?.currency)}</p>
                            </div>
                            {totalIncome > 0 && (
                                <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${budget.totalLimit > totalIncome ? 'bg-red-400' : 'bg-white/60'}`}
                                        style={{ width: `${Math.min((budget.totalLimit / totalIncome) * 100, 100)}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 bg-card border rounded-[2rem] space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-orange-500/10 rounded-2xl">
                                <AlertTriangle className="w-6 h-6 text-orange-500" />
                            </div>
                            <h3 className="font-bold">Budget Tips</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Try setting your category-wise budgets to sum up to your overall limit for better control.
                        </p>
                    </div>
                </div>

                {/* Category Budgets */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <PieChart className="w-6 h-6 text-primary" /> Category-wise Limits
                        </h2>
                        <Button onClick={handleSave} disabled={loading} className="rounded-2xl h-11 px-6 font-bold gap-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save All
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {categories.map((cat) => (
                            <div key={cat.id} className="p-5 bg-card border rounded-[2rem] hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner"
                                        style={{ backgroundColor: cat.color + '20', color: cat.color }}
                                    >
                                        {cat.icon}
                                    </div>
                                    <span className="font-bold text-lg">{cat.name}</span>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Spending Limit</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={getCategoryLimit(cat.id)}
                                            onChange={(e) => updateCategoryLimit(cat.id, parseFloat(e.target.value) || 0)}
                                            className="w-full h-11 px-4 pr-12 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                            placeholder="0.00"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                                            {user?.preferences?.currency || "USD"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </LayoutWrapper>
        </div>
    );
};

export default BudgetsPage;

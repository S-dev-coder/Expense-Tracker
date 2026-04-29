import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Calendar,
    Target,
    AlertCircle,
    AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { formatCurrency } from "../lib/currencyUtils";
import { PageHeader } from "../components/ui/PageHeader";
import { LayoutWrapper } from "../components/ui/LayoutWrapper";

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        recentTransactions: [] as any[],
    });
    const [budgetStats, setBudgetStats] = useState<any>(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [expensesRes, incomeRes, budgetRes] = await Promise.all([
                api.get("/expenses"),
                api.get("/income"),
                api.get("/budgets/stats")
            ]);

            const expenses = expensesRes.data.data;
            const incomes = incomeRes.data.data;
            const budgetData = budgetRes.data.data;

            const totalExpenses = expenses.reduce((sum: number, item: any) => sum + item.amount, 0);
            const totalIncome = incomes.reduce((sum: number, item: any) => sum + item.amount, 0);

            // Combine and sort recent transactions
            const combined = [
                ...expenses.map((e: any) => ({ ...e, type: "expense" })),
                ...incomes.map((i: any) => ({ ...i, type: "income" }))
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5);

            setStats({
                totalBalance: totalIncome - totalExpenses,
                totalIncome,
                totalExpenses,
                recentTransactions: combined,
            });
            setBudgetStats(budgetData);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse text-lg font-medium">Crunching your numbers...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <PageHeader
                title={`Welcome back, ${user?.name.split(" ")[0]}! 👋`}
                description="Here's what's happening with your finances today."
            />

            <LayoutWrapper columns={1} className="mb-8">
                {/* Stats Overview */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="relative p-8 bg-primary text-primary-foreground rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20">
                        <div className="relative z-10">
                            <p className="text-primary-foreground/70 font-bold uppercase tracking-widest text-xs">Total Balance</p>
                            <h3 className="text-4xl font-black mt-2 tracking-tighter">{formatCurrency(stats.totalBalance, user?.preferences?.currency)}</h3>
                            <div className="mt-6 flex items-center gap-2 text-sm font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full">
                                <Wallet className="w-4 h-4" />
                                {user?.preferences?.currency || "USD"} Account
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    </div>

                    <div className="group p-8 bg-card border rounded-[2.5rem] hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-6">Total Income</p>
                        <h3 className="text-3xl font-black mt-1 text-green-600 tracking-tighter">+{formatCurrency(stats.totalIncome, user?.preferences?.currency)}</h3>
                    </div>

                    <div className="group p-8 bg-card border rounded-[2.5rem] hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                <TrendingDown className="w-6 h-6" />
                            </div>
                            <ArrowDownRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-6">Total Expenses</p>
                        <h3 className="text-3xl font-black mt-1 text-red-500 tracking-tighter">-{formatCurrency(stats.totalExpenses, user?.preferences?.currency)}</h3>
                    </div>
                </div>
            </LayoutWrapper>

            <LayoutWrapper columns={2}>
                {/* Budget Progress / Empty State */}
                {budgetStats ? (
                    <div className="space-y-6 flex flex-col h-full">
                        <div className="p-8 bg-card border rounded-[2.5rem] space-y-6 flex-1">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                    <Target className="w-6 h-6 text-primary" /> Monthly Budget
                                </h2>
                                <span className="text-sm font-bold text-muted-foreground">
                                    {budgetStats.percentage.toFixed(1)}% Used
                                </span>
                            </div>
                            <div className="space-y-4">
                                <div className="h-4 bg-accent rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${budgetStats.percentage > 90 ? 'bg-red-500' : budgetStats.percentage > 75 ? 'bg-orange-500' : 'bg-primary'
                                            }`}
                                        style={{ width: `${Math.min(budgetStats.percentage, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Spent</p>
                                        <p className="text-xl font-black">{formatCurrency(budgetStats.totalSpent, user?.preferences?.currency)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Budget</p>
                                        <p className="text-xl font-black opacity-40">{formatCurrency(budgetStats.totalLimit, user?.preferences?.currency)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-card border rounded-[2.5rem] space-y-6">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-orange-500" /> Budget Alerts
                            </h2>
                            <div className="space-y-3">
                                {budgetStats.totalLimit > budgetStats.totalIncome && (
                                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-4 text-orange-600">
                                        <AlertTriangle className="w-5 h-5 shrink-0" />
                                        <p className="text-sm font-bold">Caution: Your budget exceeds your total income!</p>
                                    </div>
                                )}
                                {budgetStats.percentage > 90 ? (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-600">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p className="text-sm font-bold">Critical: You've used over 90% of your total budget!</p>
                                    </div>
                                ) : budgetStats.percentage > 75 ? (
                                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-4 text-orange-600">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p className="text-sm font-bold">Warning: You've used over 75% of your total budget.</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground font-medium">Your spending is well within limits. Keep it up!</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 bg-card border rounded-[2.5rem] space-y-4 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mb-2">
                            <Target className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-black">No Budget Set</h2>
                        <p className="text-muted-foreground text-sm max-w-[280px]">Set a monthly budget to track your spending and get alerts.</p>
                        <Link to="/budgets">
                            <Button className="mt-2 rounded-2xl font-bold shadow-lg shadow-primary/20">Set Up Budget</Button>
                        </Link>
                    </div>
                )}

                {/* Recent Activity */}
                <div className="p-8 bg-card border rounded-[2.5rem] space-y-6 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black">Recent Activity</h3>
                        <Link to="/expenses" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4 flex-1">
                        {stats.recentTransactions.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-center py-12 text-muted-foreground font-medium italic">No transactions yet. Start tracking!</p>
                            </div>
                        ) : (
                            stats.recentTransactions.map((tx, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-background/50 rounded-2xl hover:bg-background transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${tx.type === 'income' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
                                            {tx.type === 'income' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="font-bold">{tx.title}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                <Calendar className="w-3 h-3" />
                                                {format(new Date(tx.date), "MMM dd, yyyy")}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`text-lg font-black tracking-tighter ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, user?.preferences?.currency)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </LayoutWrapper>

            {/* Quick Actions / Promo */}
            <div className="mt-8 p-12 bg-card border rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden bg-gradient-to-br from-primary/5 to-transparent text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary rotate-3 shrink-0">
                        <CreditCard className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">Stay Budget-Wise!</h3>
                        <p className="text-muted-foreground mt-1 max-w-[400px] font-medium">Tracking your daily expenses helps you save more and spend smarter.</p>
                    </div>
                </div>
                <div className="flex gap-4 relative z-10 w-full md:w-auto">
                    <Link to="/expenses" className="flex-1 md:flex-none">
                        <Button className="w-full px-8 py-6 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Add Expense</Button>
                    </Link>
                    <Link to="/income" className="flex-1 md:flex-none">
                        <Button variant="outline" className="w-full px-8 py-6 rounded-2xl font-bold hover:bg-accent transition-colors">Add Income</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

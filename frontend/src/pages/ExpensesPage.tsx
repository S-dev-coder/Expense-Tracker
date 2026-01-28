import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../lib/currencyUtils";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Plus, Search, Filter, Trash2, Calendar, Tag, CreditCard, Image as ImageIcon, Loader2, Edit2 } from "lucide-react";
import { format } from "date-fns";
import AddExpenseModal from "../components/AddExpenseModal";
import { PageHeader } from "../components/ui/PageHeader";
import { LayoutWrapper } from "../components/ui/LayoutWrapper";

const ExpensesPage: React.FC = () => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [filters, setFilters] = useState({
        category: "",
        paymentMethod: "",
        startDate: "",
        endDate: "",
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [editExpense, setEditExpense] = useState<any>(null);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                search,
                ...filters
            }).toString();
            const res = await api.get(`/expenses?${queryParams}`);
            setExpenses(res.data.data);
            setSelectedIds([]); // Clear selection on fetch
        } catch (error) {
            toast.error("Failed to fetch expenses");
        } finally {
            setLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(`Delete ${selectedIds.length} expenses?`)) {
            try {
                await api.delete("/expenses/bulk", { data: { ids: selectedIds } });
                toast.success(`${selectedIds.length} expenses deleted`);
                fetchExpenses();
            } catch (error) {
                toast.error("Bulk delete failed");
            }
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchExpenses();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [search, filters]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this expense?")) {
            try {
                await api.delete(`/expenses/${id}`);
                toast.success("Expense deleted");
                fetchExpenses();
            } catch (error) {
                toast.error("Failed to delete");
            }
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <PageHeader
                title="Expenses"
                description="Track and manage your daily spending"
                action={
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="gap-2 h-11 rounded-xl shadow-lg shadow-primary/10"
                    >
                        <Plus className="w-5 h-5" />
                        Add Expense
                    </Button>
                }
            />

            <AddExpenseModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditExpense(null);
                }}
                onSuccess={fetchExpenses}
                editData={editExpense}
            />

            <LayoutWrapper columns={1}>
                {/* Search & Filter Bar */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search expenses..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-11 pl-10 pr-4 bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        {selectedIds.length > 0 && (
                            <Button
                                variant="destructive"
                                onClick={handleBulkDelete}
                                className="h-11 rounded-xl px-4 gap-2 animate-in zoom-in-95"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Delete</span> ({selectedIds.length})
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`h-11 rounded-xl px-4 gap-2 ${isFilterOpen ? "bg-accent" : ""}`}
                        >
                            <Filter className="w-4 h-4" />
                            <span className="hidden sm:inline">Filters</span>
                        </Button>
                    </div>

                    {isFilterOpen && (
                        <div className="p-4 bg-card border rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                    className="w-full h-10 px-3 bg-background border rounded-lg focus:outline-none"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Food">Food</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Bills">Bills</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Health">Health</option>
                                    <option value="Education">Education</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Payment Method</label>
                                <select
                                    value={filters.paymentMethod}
                                    onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                                    className="w-full h-10 px-3 bg-background border rounded-lg focus:outline-none"
                                >
                                    <option value="">All Methods</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Debit Card">Debit Card</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Net Banking">Net Banking</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">From Date</label>
                                <input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                    className="w-full h-10 px-3 bg-background border rounded-lg focus:outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">To Date</label>
                                <input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                    className="w-full h-10 px-3 bg-background border rounded-lg focus:outline-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Expenses List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-muted-foreground animate-pulse">Loading amazing expenses...</p>
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="p-12 border border-dashed rounded-3xl text-center bg-card/50">
                        <p className="text-muted-foreground">No expenses found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {expenses.map((expense) => (
                            <div
                                key={expense.id}
                                className={`group p-4 bg-card border rounded-2xl hover:shadow-md transition-all flex items-center justify-between gap-4 ${selectedIds.includes(expense.id) ? 'ring-2 ring-primary border-transparent' : ''}`}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(expense.id)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            toggleSelect(expense.id);
                                        }}
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                    />
                                    <div
                                        onClick={() => {
                                            setEditExpense(expense);
                                            setIsModalOpen(true);
                                        }}
                                        className="flex items-center gap-4 flex-1 cursor-pointer md:cursor-default"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold">{expense.title}</h4>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(expense.date), "MMM dd, yyyy")}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Tag className="w-3 h-3" />
                                                    {expense.category}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-full bg-accent text-[10px] uppercase font-bold tracking-wider">
                                                    {expense.paymentMethod}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-red-500">-{formatCurrency(expense.amount, user?.preferences?.currency)}</p>
                                            {expense.receiptUrl && (
                                                <button className="text-xs font-medium text-primary hover:underline flex items-center gap-1 justify-end mt-1">
                                                    <ImageIcon className="w-3 h-3" />
                                                    Receipt
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setEditExpense(expense);
                                            setIsModalOpen(true);
                                        }}
                                        className="h-10 w-10 text-primary hover:bg-primary/10 rounded-xl"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(expense.id)}
                                        className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-xl"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </LayoutWrapper>
        </div>
    );
};

export default ExpensesPage;

import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../lib/currencyUtils";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Plus, Search, Filter, Trash2, Calendar, Tag, Wallet, Loader2, Edit2 } from "lucide-react";
import { format } from "date-fns";
import AddIncomeModal from "../components/AddIncomeModal";
import { PageHeader } from "../components/ui/PageHeader";
import { LayoutWrapper } from "../components/ui/LayoutWrapper";

const IncomePage: React.FC = () => {
    const { user } = useAuth();
    const [incomes, setIncomes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        category: "",
        startDate: "",
        endDate: "",
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [editIncome, setEditIncome] = useState<any>(null);

    const fetchIncomes = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                search,
                ...filters
            }).toString();
            const res = await api.get(`/income?${queryParams}`);
            setIncomes(res.data.data);
        } catch (error) {
            toast.error("Failed to fetch income");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchIncomes();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [search, filters]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this income record?")) {
            try {
                await api.delete(`/income/${id}`);
                toast.success("Income record deleted");
                fetchIncomes();
            } catch (error) {
                toast.error("Failed to delete");
            }
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <PageHeader
                title="Income"
                description="Monitor and track your earnings"
                action={
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="gap-2 h-11 rounded-xl shadow-lg shadow-green-500/10 bg-green-600 hover:bg-green-700"
                    >
                        <Plus className="w-5 h-5" />
                        Add Income
                    </Button>
                }
            />

            <AddIncomeModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditIncome(null);
                }}
                onSuccess={fetchIncomes}
                editData={editIncome}
            />

            <LayoutWrapper columns={1}>
                {/* Search & Filter Bar */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search income..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-11 pl-10 pr-4 bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`h-11 rounded-xl px-4 gap-2 ${isFilterOpen ? "bg-accent" : ""}`}
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                        </Button>
                    </div>

                    {isFilterOpen && (
                        <div className="p-4 bg-card border rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                    className="w-full h-10 px-3 bg-background border rounded-lg focus:outline-none"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Salary">Salary</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Investment">Investment</option>
                                    <option value="Gift">Gift</option>
                                    <option value="Other">Other</option>
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

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                        <p className="text-muted-foreground animate-pulse">Fetching your earnings...</p>
                    </div>
                ) : incomes.length === 0 ? (
                    <div className="p-12 border border-dashed rounded-3xl text-center bg-card/50">
                        <p className="text-muted-foreground">No income records found.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {incomes.map((income) => (
                            <div key={income.id} className="group p-4 bg-card border rounded-2xl hover:shadow-md transition-all flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-xl bg-green-600/5 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                        <Wallet className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{income.title}</h4>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {format(new Date(income.date), "MMM dd, yyyy")}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Tag className="w-3 h-3" />
                                                {income.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-6">
                                    <p className="text-xl font-black text-green-600">+{formatCurrency(income.amount, user?.preferences?.currency)}</p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setEditIncome(income);
                                                setIsModalOpen(true);
                                            }}
                                            className="h-10 w-10 text-primary hover:bg-primary/10 rounded-xl"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(income.id)}
                                            className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-xl"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </LayoutWrapper>
        </div>
    );
};

export default IncomePage;

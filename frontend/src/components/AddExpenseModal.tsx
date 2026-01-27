import React, { useState } from "react";
import api from "../lib/api";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { X, Loader2, Upload, Calendar, Tag, CreditCard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getCurrencySymbol } from "../lib/currencyUtils";

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editData?: any;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onSuccess, editData }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const initialFormState = {
        title: "",
        amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "Cash",
        description: "",
        tags: "",
    };
    const [formData, setFormData] = useState(initialFormState);

    React.useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title || "",
                amount: editData.amount?.toString() || "",
                category: editData.category || "Food",
                date: editData.date ? new Date(editData.date).toISOString().split("T")[0] : initialFormState.date,
                paymentMethod: editData.paymentMethod || "Cash",
                description: editData.description || "",
                tags: Array.isArray(editData.tags) ? editData.tags.join(", ") : editData.tags || "",
            });
        } else {
            setFormData(initialFormState);
        }
    }, [editData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });
            if (file) {
                data.append("receipt", file);
            }

            if (editData) {
                await api.put(`/expenses/${editData.id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Expense updated successfully!");
            } else {
                await api.post("/expenses", data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Expense added successfully!");
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add expense");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b flex items-center justify-between bg-primary/5">
                    <h3 className="text-xl font-bold">{editData ? "Edit Expense" : "Add New Expense"}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-background rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            <Tag className="w-4 h-4 text-primary" /> Title
                        </label>
                        <input
                            required
                            placeholder="Lunch with team"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full h-11 px-4 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <span className="w-4 h-4 text-primary flex items-center justify-center font-bold text-xs">{getCurrencySymbol(user?.preferences?.currency)}</span> Amount
                            </label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full h-11 px-4 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" /> Date
                            </label>
                            <input
                                required
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full h-11 px-4 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Tag className="w-4 h-4 text-primary" /> Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full h-11 px-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
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
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-primary" /> Payment
                            </label>
                            <select
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                className="w-full h-11 px-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="Cash">Cash</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Debit Card">Debit Card</option>
                                <option value="UPI">UPI</option>
                                <option value="Net Banking">Net Banking</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Description (Optional)</label>
                        <textarea
                            placeholder="Add some notes..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-4 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Tags (Comma separated)</label>
                        <input
                            placeholder="lunch, work, team"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full h-11 px-4 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Receipt Image</label>
                        <div className="relative group/upload h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer overflow-hidden">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            {file ? (
                                <div className="text-center p-4">
                                    <p className="font-medium text-primary line-clamp-1">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">Click to change file</p>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-muted-foreground group-hover/upload:text-primary transition-colors" />
                                    <p className="text-sm text-muted-foreground font-medium">Click to upload receipt</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-2 h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : (editData ? "Update Expense" : "Save Expense")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;

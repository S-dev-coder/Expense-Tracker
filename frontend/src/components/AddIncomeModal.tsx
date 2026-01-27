import React, { useState } from "react";
import api from "../lib/api";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { X, Loader2, Calendar, Tag, Wallet } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getCurrencySymbol } from "../lib/currencyUtils";

interface AddIncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editData?: any;
}

const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose, onSuccess, editData }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const initialFormState = {
        title: "",
        amount: "",
        category: "Salary",
        date: new Date().toISOString().split("T")[0],
        description: "",
        tags: "",
    };
    const [formData, setFormData] = useState(initialFormState);

    React.useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title || "",
                amount: editData.amount?.toString() || "",
                category: editData.category || "Salary",
                date: editData.date ? new Date(editData.date).toISOString().split("T")[0] : initialFormState.date,
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
            const data = { ...formData };
            if (data.tags) {
                (data as any).tags = data.tags.split(",").map(t => t.trim());
            }

            if (editData) {
                await api.put(`/income/${editData.id}`, data);
                toast.success("Income record updated successfully!");
            } else {
                await api.post("/income", data);
                toast.success("Income record added successfully!");
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add income");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b flex items-center justify-between bg-green-600/5">
                    <h3 className="text-xl font-bold text-green-600">{editData ? "Edit Income" : "Add New Income"}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-background rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            <Tag className="w-4 h-4 text-green-600" /> Title
                        </label>
                        <input
                            required
                            placeholder="Monthly Salary"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full h-11 px-4 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/20"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <span className="w-4 h-4 text-green-600 flex items-center justify-center font-bold text-xs">{getCurrencySymbol(user?.preferences?.currency)}</span> Amount
                            </label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full h-11 px-4 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-green-600" /> Date
                            </label>
                            <input
                                required
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full h-11 px-4 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-green-600" /> Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full h-11 px-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/20"
                        >
                            <option value="Salary">Salary</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Investment">Investment</option>
                            <option value="Gift">Gift</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Description (Optional)</label>
                        <textarea
                            placeholder="Add some notes..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-4 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/20 min-h-[100px] resize-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Tags (Comma separated)</label>
                        <input
                            placeholder="bonus, work, project-a"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full h-11 px-4 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/20"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-2 h-12 rounded-xl font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : (editData ? "Update Income" : "Save Income")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddIncomeModal;

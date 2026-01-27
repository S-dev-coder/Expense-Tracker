import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Loader2, FolderTree, Palette } from "lucide-react";

interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    userId: string | null;
}

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        icon: "📁",
        color: "#3b82f6",
    });

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data.data);
        } catch (error) {
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editCategory) {
                await api.put(`/categories/${editCategory.id}`, formData);
                toast.success("Category updated!");
            } else {
                await api.post("/categories", formData);
                toast.success("Category created!");
            }
            fetchCategories();
            setIsModalOpen(false);
            setEditCategory(null);
            setFormData({ name: "", icon: "📁", color: "#3b82f6" });
        } catch (error) {
            toast.error("Process failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await api.delete(`/categories/${id}`);
            toast.success("Category deleted");
            fetchCategories();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete");
        }
    };

    const openEdit = (cat: Category) => {
        setEditCategory(cat);
        setFormData({ name: cat.name, icon: cat.icon, color: cat.color });
        setIsModalOpen(true);
    };

    if (loading && categories.length === 0) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Categories</h1>
                    <p className="text-muted-foreground font-medium">Personalize your expense tracking.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20 gap-2">
                    <Plus className="w-5 h-5" /> Add Category
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="group relative p-6 bg-card border rounded-[2rem] hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div
                            className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity"
                            style={{ backgroundColor: cat.color, borderRadius: '0 0 0 100%' }}
                        />
                        <div className="flex items-start justify-between relative z-10">
                            <div className="space-y-3">
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner"
                                    style={{ backgroundColor: cat.color + '20', color: cat.color }}
                                >
                                    {cat.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{cat.name}</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                        {cat.userId ? "Custom" : "System Default"}
                                    </p>
                                </div>
                            </div>
                            {cat.userId && (
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => openEdit(cat)} className="p-2 hover:bg-accent rounded-xl text-muted-foreground hover:text-primary transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-500/10 rounded-xl text-muted-foreground hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card border rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b flex items-center justify-between bg-accent/20">
                            <h3 className="text-xl font-bold">{editCategory ? "Edit Category" : "New Category"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <FolderTree className="w-4 h-4 text-primary" /> Name
                                </label>
                                <input
                                    required
                                    placeholder="e.g. Subscriptions"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full h-12 px-4 bg-background border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        Emoji Icon
                                    </label>
                                    <input
                                        required
                                        placeholder="📁"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full h-12 px-4 bg-background border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-center text-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        <Palette className="w-4 h-4 text-primary" /> Color
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            className="h-12 w-full p-1 bg-background border rounded-2xl cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 h-12 rounded-2xl font-bold">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading} className="flex-1 h-12 rounded-2xl font-bold shadow-lg shadow-primary/20">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editCategory ? "Update" : "Create")}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;

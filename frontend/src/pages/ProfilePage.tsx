import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { User, Settings, Globe, Moon, Sun, Trash2, Loader2, Save } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { LayoutWrapper } from "../components/ui/LayoutWrapper";

const ProfilePage: React.FC = () => {
    const { user, updateProfile, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        preferences: {
            currency: user?.preferences?.currency || "USD",
            timezone: user?.preferences?.timezone || "UTC",
            theme: user?.preferences?.theme || "light",
        },
    });

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateProfile(formData);
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            setIsDeleting(true);
            try {
                // Implementation for delete API call would go here
                toast.success("Account deleted successfully.");
                logout();
            } catch (error: any) {
                toast.error("Failed to delete account.");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <PageHeader
                title="Profile & Settings"
                description="Manage your account information and preferences"
            />

            <LayoutWrapper columns={2}>

                <div className="space-y-6">
                    <section className="p-6 bg-card border rounded-xl shadow-sm space-y-4">
                        <div className="flex items-center gap-2 font-semibold">
                            <User className="w-5 h-5 text-primary" />
                            Personal Information
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Name</label>
                                <input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full h-10 px-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full h-10 px-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="pt-4 flex items-center gap-2 font-semibold">
                                <Globe className="w-5 h-5 text-primary" />
                                Preferences
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Currency</label>
                                    <select
                                        value={formData.preferences.currency}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            preferences: { ...formData.preferences, currency: e.target.value }
                                        })}
                                        className="w-full h-10 px-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="INR">INR (₹)</option>
                                        <option value="JPY">JPY (¥)</option>
                                        <option value="AUD">AUD (A$)</option>
                                        <option value="CAD">CAD (C$)</option>
                                        <option value="CNY">CNY (¥)</option>
                                        <option value="AED">AED (د.إ)</option>
                                        <option value="SGD">SGD (S$)</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Timezone</label>
                                    <select
                                        value={formData.preferences.timezone}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            preferences: { ...formData.preferences, timezone: e.target.value }
                                        })}
                                        className="w-full h-10 px-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="UTC">UTC</option>
                                        <option value="America/New_York">EST</option>
                                        <option value="Europe/London">GMT</option>
                                        <option value="Asia/Kolkata">IST</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Theme</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({
                                            ...formData,
                                            preferences: { ...formData.preferences, theme: "light" }
                                        })}
                                        className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-lg border transition-all ${formData.preferences.theme === "light" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:bg-accent"}`}
                                    >
                                        <Sun className="w-4 h-4" />
                                        Light
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({
                                            ...formData,
                                            preferences: { ...formData.preferences, theme: "dark" }
                                        })}
                                        className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-lg border transition-all ${formData.preferences.theme === "dark" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:bg-accent"}`}
                                    >
                                        <Moon className="w-4 h-4" />
                                        Dark
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-11 rounded-xl font-semibold shadow-lg shadow-primary/10" disabled={isLoading}>
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Changes
                            </Button>
                        </form>
                    </section>
                </div>

                {/* Account Actions Section */}
                <div className="space-y-6">
                    <section className="p-6 bg-card border rounded-xl shadow-sm space-y-4">
                        <div className="flex items-center gap-2 font-semibold text-red-500">
                            <Settings className="w-5 h-5" />
                            Danger Zone
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button
                            variant="outline"
                            className="w-full border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-600 h-10 rounded-xl"
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                            Delete Account
                        </Button>
                    </section>
                </div>
            </LayoutWrapper>
        </div>
    );
};

export default ProfilePage;

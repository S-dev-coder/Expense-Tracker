import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { LogOut, User, LayoutDashboard, Settings, CreditCard, TrendingUp, FolderTree, PieChart } from "lucide-react";

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex min-h-screen bg-background font-sans antialiased text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-card hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        ExpenseTracker
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-1">
                    <Link to="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Link>
                    <Link to="/expenses" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors">
                        <CreditCard className="w-4 h-4 text-red-500" />
                        Expenses
                    </Link>
                    <Link to="/income" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Income
                    </Link>
                    <Link to="/categories" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors">
                        <FolderTree className="w-4 h-4 text-orange-500" />
                        Categories
                    </Link>
                    <Link to="/budgets" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors">
                        <PieChart className="w-4 h-4 text-blue-500" />
                        Budgets
                    </Link>
                </nav>
                <div className="p-4 border-t space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors w-full">
                        <Settings className="w-4 h-4" />
                        Settings
                    </Link>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-9 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={handleLogout}>
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 border-b flex items-center justify-between px-6 md:hidden">
                    <h1 className="text-lg font-bold">ExpenseTracker</h1>
                    <Button variant="ghost" size="icon" onClick={handleLogout}>
                        <LogOut className="w-5 h-5" />
                    </Button>
                </header>
                <div className="flex-1 overflow-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;

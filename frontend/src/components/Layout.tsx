import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { LogOut, User, LayoutDashboard, Settings, CreditCard, TrendingUp, FolderTree, PieChart, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const NavItems = () => (
        <>
            <Link to="/" onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname === "/" ? "bg-accent text-primary" : "hover:bg-accent"}`}>
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Dashboard</span>}
            </Link>
            <Link to="/expenses" onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname === "/expenses" ? "bg-accent text-primary" : "hover:bg-accent"}`}>
                <CreditCard className="w-4 h-4 text-red-500 shrink-0" />
                {!isCollapsed && <span>Expenses</span>}
            </Link>
            <Link to="/income" onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname === "/income" ? "bg-accent text-primary" : "hover:bg-accent"}`}>
                <TrendingUp className="w-4 h-4 text-green-500 shrink-0" />
                {!isCollapsed && <span>Income</span>}
            </Link>
            <Link to="/categories" onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname === "/categories" ? "bg-accent text-primary" : "hover:bg-accent"}`}>
                <FolderTree className="w-4 h-4 text-orange-500 shrink-0" />
                {!isCollapsed && <span>Categories</span>}
            </Link>
            <Link to="/budgets" onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname === "/budgets" ? "bg-accent text-primary" : "hover:bg-accent"}`}>
                <PieChart className="w-4 h-4 text-blue-500 shrink-0" />
                {!isCollapsed && <span>Budgets</span>}
            </Link>
        </>
    );

    return (
        <div className="flex min-h-screen bg-background font-sans antialiased text-foreground">
            {/* Desktop Sidebar */}
            <aside className={`border-r bg-card hidden md:flex flex-col transition-all duration-300 ease-in-out relative ${isCollapsed ? 'w-16' : 'w-64'}`}>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 bg-card border rounded-full p-1 hover:bg-accent z-10 hidden md:block"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                <div className={`p-6 overflow-hidden ${isCollapsed ? 'items-center px-4' : ''}`}>
                    <h1 className={`text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent origin-left transition-all duration-300 ${isCollapsed ? 'scale-0 w-0' : 'scale-100'}`}>
                        ExpenseTracker
                    </h1>
                    {isCollapsed && <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">ET</div>}
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    <NavItems />
                </nav>

                <div className={`p-4 border-t space-y-2 ${isCollapsed ? 'items-center px-2' : ''}`}>
                    <div className={`flex items-center gap-3 px-3 py-2 ${isCollapsed ? 'justify-center px-0' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-primary" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">{user?.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        )}
                    </div>
                    <Link to="/profile" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors w-full ${isCollapsed ? 'justify-center' : ''}`}>
                        <Settings className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span>Settings</span>}
                    </Link>
                    <Button variant="ghost" className={`w-full justify-start gap-3 h-9 text-red-500 hover:text-red-600 hover:bg-red-500/10 ${isCollapsed ? 'justify-center px-0' : ''}`} onClick={handleLogout}>
                        <LogOut className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span>Logout</span>}
                    </Button>
                </div>
            </aside>

            {/* Mobile Drawer */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
                    <aside className="absolute inset-y-0 left-0 w-full max-w-xs bg-card border-r flex flex-col animate-in slide-in-from-left duration-300">
                        <div className="p-6 flex items-center justify-between">
                            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                ExpenseTracker
                            </h1>
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <nav className="flex-1 px-4 space-y-2">
                            <NavItems />
                        </nav>
                        <div className="p-4 border-t space-y-2">
                            <div className="flex items-center gap-3 px-3 py-2 mb-2">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-bold truncate">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                </div>
                            </div>
                            <Link to="/profile" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3 px-3 py-4 text-base font-bold rounded-xl hover:bg-accent transition-colors w-full bg-accent/50 mb-2">
                                <Settings className="w-5 h-5" />
                                Settings
                            </Link>
                            <Button variant="ghost" className="w-full justify-start gap-3 h-14 text-red-500 font-bold text-base hover:bg-red-500/10 rounded-xl" onClick={handleLogout}>
                                <LogOut className="w-5 h-5" />
                                Logout
                            </Button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 border-b flex items-center justify-between px-6 md:hidden bg-card/50 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)} className="md:hidden">
                            <Menu className="w-6 h-6" />
                        </Button>
                        <h1 className="text-lg font-bold">ExpenseTracker</h1>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-4 md:p-8 pb-32 md:pb-8">
                    <Outlet />
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-card/80 backdrop-blur-lg border rounded-2xl flex items-center justify-around px-2 shadow-2xl z-50">
                    <Link to="/" className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${location.pathname === "/" ? "text-primary scale-110" : "text-muted-foreground"}`}>
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Home</span>
                    </Link>
                    <Link to="/expenses" className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${location.pathname === "/expenses" ? "text-red-500 scale-110" : "text-muted-foreground"}`}>
                        <CreditCard className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Pay</span>
                    </Link>
                    <Link to="/income" className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${location.pathname === "/income" ? "text-green-500 scale-110" : "text-muted-foreground"}`}>
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Earn</span>
                    </Link>
                    <Link to="/budgets" className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${location.pathname === "/budgets" ? "text-blue-500 scale-110" : "text-muted-foreground"}`}>
                        <PieChart className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Budget</span>
                    </Link>
                    <Link to="/profile" className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${location.pathname === "/profile" ? "text-primary scale-110" : "text-muted-foreground"}`}>
                        <User className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Me</span>
                    </Link>
                </nav>
            </main>
        </div>
    );
};

export default Layout;

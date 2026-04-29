import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
    TrendingUp,
    PiggyBank,
    BarChart3,
    Wallet,
    Bell,
    Shield,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    Users,
    DollarSign,
    Star,
    Menu,
    X,
} from "lucide-react";

const features = [
    {
        icon: TrendingUp,
        title: "Smart Expense Tracking",
        description:
            "Log your daily spending in seconds. Categorize transactions instantly and see where every dollar goes.",
    },
    {
        icon: PiggyBank,
        title: "Budget Alerts",
        description:
            "Set monthly budgets and get real-time alerts when you're approaching your limits. Never overspend again.",
    },
    {
        icon: BarChart3,
        title: "Visual Reports",
        description:
            "Beautiful charts and graphs that make understanding your finances effortless. Spot trends at a glance.",
    },
    {
        icon: Wallet,
        title: "Multi-Currency Support",
        description:
            "Track expenses in multiple currencies. Perfect for travelers and anyone dealing with international transactions.",
    },
    {
        icon: Bell,
        title: "Smart Notifications",
        description:
            "Timely reminders for bill payments, budget thresholds, and weekly spending summaries delivered to your inbox.",
    },
    {
        icon: Shield,
        title: "Bank-Level Security",
        description:
            "Your financial data is encrypted end-to-end. We never share your information with third parties.",
    },
];

const steps = [
    {
        number: "01",
        title: "Create Your Account",
        description: "Sign up in under a minute. No credit card required.",
    },
    {
        number: "02",
        title: "Add Your Transactions",
        description: "Start logging expenses and income manually or sync your accounts.",
    },
    {
        number: "03",
        title: "Stay on Track",
        description: "Monitor your budget, review reports, and make smarter financial decisions.",
    },
];

const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "$2M+", label: "Expenses Tracked" },
    { value: "95%", label: "Satisfaction Rate" },
];

const testimonials = [
    {
        quote:
            "I've tried dozens of expense trackers. This one is by far the cleanest and most intuitive. The budget alerts alone saved me hundreds.",
        name: "Sarah Chen",
        role: "Freelance Designer",
    },
    {
        quote:
            "Finally an app that doesn't overwhelm me with features I never use. Simple, beautiful, and it just works.",
        name: "Marcus Johnson",
        role: "Software Engineer",
    },
    {
        quote:
            "The visual reports are incredible. I can finally see where my money goes every month. Highly recommended!",
        name: "Emily Rodriguez",
        role: "Marketing Manager",
    },
];

const faqs = [
    {
        question: "Is this really free?",
        answer:
            "Yes! Our core features are completely free to use. We offer a Pro plan for power users who need advanced reports and multi-currency support.",
    },
    {
        question: "How secure is my data?",
        answer:
            "We use industry-standard encryption for all data. Your financial information is never shared with third parties. We're committed to your privacy.",
    },
    {
        question: "Can I access my data offline?",
        answer:
            "Our progressive web app works offline. Your data syncs automatically once you're back online, so you never lose a transaction.",
    },
    {
        question: "Does it support multiple currencies?",
        answer:
            "Absolutely. You can track expenses in different currencies and the app will convert them to your base currency for accurate reporting.",
    },
];

function FAQItem({
    question,
    answer,
    isOpen,
    onClick,
}: {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}) {
    return (
        <div className="border-b last:border-b-0">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between py-6 text-left hover:text-primary transition-colors"
            >
                <span className="font-bold text-base pr-4">{question}</span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 shrink-0 text-muted-foreground" />
                ) : (
                    <ChevronDown className="w-5 h-5 shrink-0 text-muted-foreground" />
                )}
            </button>
            {isOpen && (
                <p className="pb-6 text-muted-foreground leading-relaxed">{answer}</p>
            )}
        </div>
    );
}

const LandingPage: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b">
                <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-black text-lg tracking-tight">PennyWise</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            How It Works
                        </a>
                        <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Reviews
                        </a>
                        <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            FAQ
                        </a>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">
                                Log In
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button size="sm" className="shadow-md">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>
                </nav>
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-background border-t px-6 py-4 space-y-3">
                        <a href="#features" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#how-it-works" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                        <a href="#testimonials" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
                        <a href="#faq" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
                        <div className="pt-3 border-t flex gap-3">
                            <Link to="/login" className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">Log In</Button>
                            </Link>
                            <Link to="/register" className="flex-1">
                                <Button size="sm" className="w-full">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <Star className="w-3 h-3 fill-current" />
                        Trusted by 10,000+ users worldwide
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
                        Take Control of Your{" "}
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Finances
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Track expenses, manage budgets, and visualize your spending — all in one
                        beautifully designed app. Start your journey to financial freedom today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/register">
                            <Button size="lg" className="px-8 py-6 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                                Get Started Free
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <a href="#features">
                            <Button variant="outline" size="lg" className="px-8 py-6 rounded-2xl font-bold">
                                Learn More
                            </Button>
                        </a>
                    </div>
                    <p className="text-sm text-muted-foreground pt-2">
                        No credit card required · Free forever plan available
                    </p>
                </div>

                {/* Hero Visual */}
                <div className="max-w-5xl mx-auto mt-20 rounded-[2.5rem] overflow-hidden bg-card border shadow-2xl">
                    <div className="bg-gradient-to-br from-primary/5 via-background to-accent/20 p-12 md:p-16">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <div className="h-4 w-24 bg-muted rounded-full" />
                                <div className="h-8 w-32 bg-primary/20 rounded-xl" />
                                <div className="space-y-2">
                                    {[80, 60, 90, 50].map((w, i) => (
                                        <div key={i} className="h-3 bg-primary/10 rounded-full" style={{ width: `${w}%` }} />
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-2 bg-card border rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Income</p>
                                        <p className="text-2xl font-black text-green-600">$4,250.00</p>
                                    </div>
                                </div>
                                <div className="h-24 bg-gradient-to-t from-green-500/10 to-transparent rounded-xl flex items-end gap-2 p-2">
                                    {[40, 60, 45, 80, 65, 90, 75].map((h, i) => (
                                        <div key={i} className="flex-1 bg-green-500/40 rounded-t-md" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 bg-accent/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Everything You Need
                        </p>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                            Powerful Features
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                            Packed with everything you need to manage your money smarter.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="group p-8 bg-card border rounded-[2rem] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-black mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Simple Process
                        </p>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                            How It Works
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                            Get started in minutes. No complex setup required.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, i) => (
                            <div key={i} className="relative text-center space-y-4">
                                <div className="w-20 h-20 bg-primary text-primary-foreground rounded-[2rem] flex items-center justify-center text-2xl font-black mx-auto shadow-xl shadow-primary/20">
                                    {step.number}
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
                                )}
                                <h3 className="text-xl font-black">{step.title}</h3>
                                <p className="text-muted-foreground leading-relaxed max-w-[260px] mx-auto">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-6 bg-primary text-primary-foreground">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {stats.map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <p className="text-5xl md:text-6xl font-black tracking-tighter">{stat.value}</p>
                                <p className="text-sm font-bold uppercase tracking-widest text-primary-foreground/60">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Don't Just Take Our Word
                        </p>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                            Loved by Users
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className="p-8 bg-card border rounded-[2rem] space-y-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
                                <div>
                                    <p className="font-bold">{t.name}</p>
                                    <p className="text-sm text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-24 px-6 bg-accent/30">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12 space-y-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Common Questions
                        </p>
                        <h2 className="text-4xl font-black tracking-tight">FAQ</h2>
                    </div>
                    <div className="bg-card border rounded-[2rem] px-8">
                        {faqs.map((faq, i) => (
                            <FAQItem
                                key={i}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openFaq === i}
                                onClick={() => toggleFaq(i)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative p-16 md:p-20 bg-primary text-primary-foreground rounded-[2.5rem] text-center space-y-8 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl" />
                        <div className="relative z-10 space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                                Ready to Get Started?
                            </h2>
                            <p className="text-primary-foreground/70 max-w-xl mx-auto text-lg">
                                Join thousands of users who have already taken control of their finances.
                                It only takes a minute.
                            </p>
                            <Link to="/register">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="px-10 py-7 rounded-2xl font-bold text-primary border-primary-foreground/20 bg-white/10 hover:bg-white/20 shadow-xl mt-2"
                                >
                                    Create Free Account
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                            <Wallet className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                        <span className="font-black text-base tracking-tight">PennyWise</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
                        <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
                        <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Register</Link>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} PennyWise. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

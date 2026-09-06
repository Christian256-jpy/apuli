import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/DashboardCard";
import { ModuleCard } from "@/components/ModuleCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import {
  TrendingUp,
  Package,
  Wallet,
  Users,
  ShoppingCart,
  Receipt,
  BarChart3,
  CreditCard,
  LogOut,
} from "lucide-react";
import heroImage from "@/assets/hero-illustration.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check manager role
        if (session?.user) {
          setTimeout(() => {
            checkManagerRole(session.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        checkManagerRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkManagerRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "manager")
      .maybeSingle();
    
    setIsManager(!!data);
  };

  const handleGetStarted = () => {
    if (session) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  const handleModuleClick = () => {
    if (!user) {
      toast.info("Please sign in", {
        description: "You need to sign in to access this module",
      });
      navigate("/auth");
      return;
    }
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--gradient-hero)] flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-2xl bg-[var(--gradient-primary)] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BarChart3 className="h-10 w-10 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">BIBIYANO</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#modules" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Modules
            </a>
            {user ? (
              <>
                {isManager && (
                  <Button variant="ghost" onClick={() => navigate("/users")}>
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                )}
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleSignIn}>Sign In</Button>
                <Button onClick={handleGetStarted}>Get Started</Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              All-in-One Business Solution
            </div>
            <h2 className="text-5xl font-bold leading-tight">
              Manage Your Business
              <span className="text-primary"> Effortlessly</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Complete sales, inventory, cash flow, and debt management system designed for small to medium enterprises. Streamline operations with automated receipt generation and mobile money integration.
            </p>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Business Management Dashboard"
              className="rounded-2xl shadow-[var(--shadow-elevated)]"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Daily Sales"
            value="UGX 2.4M"
            icon={TrendingUp}
            trend="+12.5% from yesterday"
            variant="success"
          />
          <DashboardCard
            title="Products in Stock"
            value="1,247"
            icon={Package}
            trend="23 low stock items"
            variant="warning"
          />
          <DashboardCard
            title="Cash at Hand"
            value="UGX 850K"
            icon={Wallet}
            trend="UGX 1.2M at bank"
            variant="default"
          />
          <DashboardCard
            title="Active Cashiers"
            value="8"
            icon={Users}
            trend="2 managers online"
            variant="default"
          />
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Powerful Features</h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to run your business efficiently, from inventory tracking to financial management.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModuleCard
            title="Sales & Purchases"
            description="Track all transactions with automated receipt generation and real-time inventory updates."
            icon={ShoppingCart}
            color="primary"
            onClick={handleModuleClick}
          />
          <ModuleCard
            title="Inventory Management"
            description="Barcode scanning, low-stock alerts, and automatic stock updates after every transaction."
            icon={Package}
            color="success"
            onClick={handleModuleClick}
          />
          <ModuleCard
            title="Cash Management"
            description="Monitor cash at hand and bank with automatic balance updates and transfer tracking."
            icon={Wallet}
            color="warning"
            onClick={handleModuleClick}
          />
          <ModuleCard
            title="Debt Tracking"
            description="Manage receivables and payables with due date reminders and payment status tracking."
            icon={Receipt}
            color="primary"
            onClick={handleModuleClick}
          />
          <ModuleCard
            title="Mobile Money"
            description="Integrated MTN and Airtel Money payments with automatic transaction confirmation."
            icon={CreditCard}
            color="success"
            onClick={handleModuleClick}
          />
          <ModuleCard
            title="Analytics & Reports"
            description="Daily, weekly, and monthly reports with export to PDF and Excel for easy sharing."
            icon={BarChart3}
            color="warning"
            onClick={handleModuleClick}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="rounded-3xl bg-[var(--gradient-primary)] p-12 text-center text-primary-foreground">
          <h3 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of businesses already using BIBIYANO to streamline their operations.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8" onClick={handleGetStarted}>
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[var(--gradient-primary)] flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">BIBIYANO</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 BIBIYANO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

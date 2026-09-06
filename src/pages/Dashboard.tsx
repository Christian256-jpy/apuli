import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCard } from "@/components/DashboardCard";
import { Package, ShoppingCart, Wallet, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalTransactions: 0,
    cashAtHand: 0,
    todaySales: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total products
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // Get total transactions
      const { count: transactionsCount } = await supabase
        .from("transactions")
        .select("*", { count: "exact", head: true });

      // Get cash at hand
      const { data: cashData } = await supabase
        .from("cash_management")
        .select("balance")
        .eq("type", "cash_at_hand")
        .order("date_time", { ascending: false })
        .limit(1)
        .maybeSingle();

      // Get today's sales
      const today = new Date().toISOString().split("T")[0];
      const { data: salesData } = await supabase
        .from("transactions")
        .select("total_amount")
        .eq("type", "sale")
        .gte("date_time", `${today}T00:00:00`)
        .lte("date_time", `${today}T23:59:59`);

      const todaySales = salesData?.reduce((sum, t) => sum + Number(t.total_amount), 0) || 0;

      setStats({
        totalProducts: productsCount || 0,
        totalTransactions: transactionsCount || 0,
        cashAtHand: cashData?.balance || 0,
        todaySales,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to BIBIYANO Business Management System
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Products"
          value={loading ? "..." : stats.totalProducts.toString()}
          icon={Package}
          variant="default"
        />
        <DashboardCard
          title="Transactions"
          value={loading ? "..." : stats.totalTransactions.toString()}
          icon={ShoppingCart}
          variant="success"
        />
        <DashboardCard
          title="Cash at Hand"
          value={loading ? "..." : `${stats.cashAtHand.toLocaleString()} UGX`}
          icon={Wallet}
          variant="warning"
        />
        <DashboardCard
          title="Today's Sales"
          value={loading ? "..." : `${stats.todaySales.toLocaleString()} UGX`}
          icon={TrendingUp}
          trend="+12% from yesterday"
          variant="success"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Use the navigation menu to access different modules and manage your business operations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

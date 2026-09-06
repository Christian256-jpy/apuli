import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";

export default function Analytics() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalPurchases: 0,
    netProfit: 0,
    transactionsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Get all transactions
      const { data: salesData } = await supabase
        .from("transactions")
        .select("total_amount")
        .eq("type", "sale");

      const { data: purchasesData } = await supabase
        .from("transactions")
        .select("total_amount")
        .eq("type", "purchase");

      const totalSales = salesData?.reduce((sum, t) => sum + Number(t.total_amount), 0) || 0;
      const totalPurchases = purchasesData?.reduce((sum, t) => sum + Number(t.total_amount), 0) || 0;

      const { count: transactionsCount } = await supabase
        .from("transactions")
        .select("*", { count: "exact", head: true });

      setStats({
        totalSales,
        totalPurchases,
        netProfit: totalSales - totalPurchases,
        transactionsCount: transactionsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics & Reports</h1>
        <p className="text-muted-foreground">Business performance overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Sales"
          value={loading ? "..." : `${stats.totalSales.toLocaleString()} UGX`}
          icon={TrendingUp}
          variant="success"
          trend="+20% from last month"
        />
        <DashboardCard
          title="Total Purchases"
          value={loading ? "..." : `${stats.totalPurchases.toLocaleString()} UGX`}
          icon={TrendingDown}
          variant="warning"
        />
        <DashboardCard
          title="Net Profit"
          value={loading ? "..." : `${stats.netProfit.toLocaleString()} UGX`}
          icon={DollarSign}
          variant={stats.netProfit >= 0 ? "success" : "warning"}
          trend={stats.netProfit >= 0 ? "Profitable" : "Loss"}
        />
        <DashboardCard
          title="Transactions"
          value={loading ? "..." : stats.transactionsCount.toString()}
          icon={BarChart3}
          variant="default"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="font-bold">{stats.totalSales.toLocaleString()} UGX</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Cost</span>
                <span className="font-bold">{stats.totalPurchases.toLocaleString()} UGX</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-muted-foreground">Net Profit</span>
                <span className={`font-bold ${stats.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {stats.netProfit.toLocaleString()} UGX
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Profit Margin</span>
                <span className="font-bold">
                  {stats.totalSales > 0
                    ? ((stats.netProfit / stats.totalSales) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Transactions</span>
                <span className="font-bold">{stats.transactionsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg. Transaction</span>
                <span className="font-bold">
                  {stats.transactionsCount > 0
                    ? (stats.totalSales / stats.transactionsCount).toLocaleString()
                    : 0}{" "}
                  UGX
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your business is {stats.netProfit >= 0 ? "profitable" : "running at a loss"}. 
            {stats.netProfit >= 0 
              ? " Keep up the good work and continue monitoring your expenses." 
              : " Consider reviewing your pricing strategy and reducing operational costs."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

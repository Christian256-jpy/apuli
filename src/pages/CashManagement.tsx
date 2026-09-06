import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/DashboardCard";
import { Wallet, Building2, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

export default function CashManagement() {
  const [cashAtHand, setCashAtHand] = useState(0);
  const [cashAtBank, setCashAtBank] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "cash_at_hand" as "cash_at_hand" | "cash_at_bank",
    balance: "",
  });

  useEffect(() => {
    fetchCashBalances();
  }, []);

  const fetchCashBalances = async () => {
    const { data: handData } = await supabase
      .from("cash_management")
      .select("balance")
      .eq("type", "cash_at_hand")
      .order("date_time", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: bankData } = await supabase
      .from("cash_management")
      .select("balance")
      .eq("type", "cash_at_bank")
      .order("date_time", { ascending: false })
      .limit(1)
      .maybeSingle();

    setCashAtHand(handData?.balance || 0);
    setCashAtBank(bankData?.balance || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const balance = parseFloat(formData.balance);
      if (isNaN(balance) || balance < 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      const { error } = await supabase.from("cash_management").insert([
        {
          type: formData.type,
          balance,
        },
      ]);

      if (error) throw error;

      toast.success("Cash balance updated successfully");
      setDialogOpen(false);
      setFormData({ type: "cash_at_hand", balance: "" });
      fetchCashBalances();
    } catch (error: any) {
      toast.error(error.message || "Failed to update balance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cash Management</h1>
          <p className="text-muted-foreground">Track cash at hand and bank</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Update Balance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Cash Balance</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash_at_hand">Cash at Hand</SelectItem>
                    <SelectItem value="cash_at_bank">Cash at Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="balance">Amount (UGX)</Label>
                <Input
                  id="balance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) =>
                    setFormData({ ...formData, balance: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Balance"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Cash at Hand"
          value={`${cashAtHand.toLocaleString()} UGX`}
          icon={Wallet}
          variant="success"
        />
        <DashboardCard
          title="Cash at Bank"
          value={`${cashAtBank.toLocaleString()} UGX`}
          icon={Building2}
          variant="default"
        />
        <DashboardCard
          title="Total Cash"
          value={`${(cashAtHand + cashAtBank).toLocaleString()} UGX`}
          icon={ArrowLeftRight}
          variant="warning"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cash Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Cash at Hand</p>
                <p className="text-2xl font-bold">
                  {cashAtHand.toLocaleString()} UGX
                </p>
              </div>
              <Wallet className="h-8 w-8 text-success" />
            </div>
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Cash at Bank</p>
                <p className="text-2xl font-bold">
                  {cashAtBank.toLocaleString()} UGX
                </p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

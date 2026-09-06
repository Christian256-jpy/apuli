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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const paymentSchema = z.object({
  transaction_id: z.string().uuid("Please select a transaction"),
  payment_mode: z.enum(["cash", "mtn", "airtel"]),
  amount: z.number().min(0, "Must be positive"),
  reference_code: z.string().max(50).optional(),
});

export default function Payments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    transaction_id: "",
    payment_mode: "cash" as "cash" | "mtn" | "airtel",
    amount: "",
    reference_code: "",
  });

  useEffect(() => {
    fetchPayments();
    fetchTransactions();
  }, []);

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        transactions (
          transaction_id,
          type,
          total_amount
        )
      `)
      .order("date_time", { ascending: false });

    if (error) {
      toast.error("Error loading payments");
      return;
    }

    setPayments(data || []);
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date_time", { ascending: false });

    if (error) {
      toast.error("Error loading transactions");
      return;
    }

    setTransactions(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check authentication first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to continue");
        return;
      }

      // Validate transaction selection
      if (!formData.transaction_id) {
        toast.error("Please select a transaction");
        return;
      }

      const data = {
        transaction_id: formData.transaction_id,
        payment_mode: formData.payment_mode,
        amount: parseFloat(formData.amount),
        reference_code: formData.reference_code.trim() || null,
      };

      paymentSchema.parse(data);

      const { error } = await supabase.from("payments").insert([data]);

      if (error) {
        console.error("Payment insert error:", error);
        throw error;
      }

      toast.success("Payment recorded successfully");
      setDialogOpen(false);
      setFormData({
        transaction_id: "",
        payment_mode: "cash",
        amount: "",
        reference_code: "",
      });
      fetchPayments();
    } catch (error: any) {
      console.error("Payment submission error:", error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to record payment");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Payments</h1>
          <p className="text-muted-foreground">Record and track payments</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Coins className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {transactions.length === 0 ? (
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-muted-foreground">
                    No transactions available. Please create a transaction first.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Transaction *</Label>
                  <Select
                    value={formData.transaction_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, transaction_id: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transaction" />
                    </SelectTrigger>
                    <SelectContent>
                      {transactions.map((transaction) => (
                        <SelectItem
                          key={transaction.transaction_id}
                          value={transaction.transaction_id}
                        >
                          {transaction.type} - {parseFloat(transaction.total_amount).toLocaleString()} UGX -{" "}
                          {new Date(transaction.date_time).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select
                  value={formData.payment_mode}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, payment_mode: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                    <SelectItem value="airtel">Airtel Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (UGX) *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Reference Code</Label>
                <Input
                  id="reference"
                  value={formData.reference_code}
                  onChange={(e) =>
                    setFormData({ ...formData, reference_code: e.target.value })
                  }
                  maxLength={50}
                  placeholder="Optional reference number"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || transactions.length === 0}
              >
                {loading ? "Saving..." : "Record Payment"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No payments recorded.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.payment_id}>
                      <TableCell>
                        {new Date(payment.date_time).toLocaleString()}
                      </TableCell>
                      <TableCell className="uppercase">{payment.payment_mode}</TableCell>
                      <TableCell className="text-right font-medium">
                        {parseFloat(payment.amount).toLocaleString()} UGX
                      </TableCell>
                      <TableCell>{payment.reference_code || "-"}</TableCell>
                      <TableCell className="capitalize">{payment.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

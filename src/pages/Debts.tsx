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
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const debtSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: z.enum(["receivable", "payable"]),
  amount: z.number().min(0, "Must be positive"),
  due_date: z.string().optional(),
});

export default function Debts() {
  const [debts, setDebts] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "receivable" as "receivable" | "payable",
    amount: "",
    due_date: "",
  });

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    const { data, error } = await supabase
      .from("debts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error loading debts");
      return;
    }

    setDebts(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        name: formData.name,
        type: formData.type,
        amount: parseFloat(formData.amount),
        due_date: formData.due_date || null,
      };

      debtSchema.parse(data);

      const { error } = await supabase.from("debts").insert([data]);

      if (error) throw error;

      toast.success("Debt recorded successfully");
      setDialogOpen(false);
      setFormData({ name: "", type: "receivable", amount: "", due_date: "" });
      fetchDebts();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to record debt");
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (debtId: string) => {
    const { error } = await supabase
      .from("debts")
      .update({ status: "paid" })
      .eq("debt_id", debtId);

    if (error) {
      toast.error("Failed to update debt status");
      return;
    }

    toast.success("Debt marked as paid");
    fetchDebts();
  };

  const stats = {
    receivable: debts
      .filter((d) => d.type === "receivable" && d.status === "pending")
      .reduce((sum, d) => sum + parseFloat(d.amount), 0),
    payable: debts
      .filter((d) => d.type === "payable" && d.status === "pending")
      .reduce((sum, d) => sum + parseFloat(d.amount), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Debts Management</h1>
          <p className="text-muted-foreground">Track receivables and payables</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              Record Debt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Debt</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  maxLength={100}
                />
              </div>
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
                    <SelectItem value="receivable">Receivable (Owed to us)</SelectItem>
                    <SelectItem value="payable">Payable (We owe)</SelectItem>
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
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) =>
                    setFormData({ ...formData, due_date: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Record Debt"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-success">Receivables</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.receivable.toLocaleString()} UGX</p>
            <p className="text-sm text-muted-foreground mt-1">
              Amount owed to the business
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Payables</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.payable.toLocaleString()} UGX</p>
            <p className="text-sm text-muted-foreground mt-1">
              Amount owed by the business
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Debts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No debts recorded.
                    </TableCell>
                  </TableRow>
                ) : (
                  debts.map((debt) => (
                    <TableRow key={debt.debt_id}>
                      <TableCell className="font-medium">{debt.name}</TableCell>
                      <TableCell className="capitalize">
                        <Badge variant={debt.type === "receivable" ? "default" : "secondary"}>
                          {debt.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {parseFloat(debt.amount).toLocaleString()} UGX
                      </TableCell>
                      <TableCell>
                        {debt.due_date
                          ? new Date(debt.due_date).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={debt.status === "paid" ? "default" : "secondary"}>
                          {debt.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {debt.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsPaid(debt.debt_id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Paid
                          </Button>
                        )}
                      </TableCell>
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

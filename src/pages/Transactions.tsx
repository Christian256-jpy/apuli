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
import { ShoppingCart, Plus, Trash2, Printer } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import Receipt from "@/components/Receipt";

const transactionSchema = z.object({
  type: z.enum(["sale", "purchase"]),
  payment_mode: z.enum(["cash", "mtn", "airtel"]),
  items: z.array(z.object({
    product_id: z.string(),
    quantity: z.number().min(1),
    unit_price: z.number().min(0),
  })).min(1, "At least one item required"),
});

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "sale" as "sale" | "purchase",
    payment_mode: "cash" as "cash" | "mtn" | "airtel",
  });
  const [cart, setCart] = useState<any[]>([]);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        transaction_items (
          *,
          products (name)
        )
      `)
      .order("date_time", { ascending: false });

    if (error) {
      toast.error("Error loading transactions");
      return;
    }

    setTransactions(data || []);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Error loading products");
      return;
    }

    setProducts(data || []);
  };

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.product_id === productId);
    if (!product) return;

    const existingItem = cart.find((item) => item.product_id === productId);
    if (existingItem) {
      toast.error("Product already in cart");
      return;
    }

    setCart([
      ...cart,
      {
        product_id: productId,
        product_name: product.name,
        quantity: 1,
        unit_price: parseFloat(product.unit_price_sell),
      },
    ]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateCartItem = (index: number, field: string, value: any) => {
    const newCart = [...cart];
    newCart[index][field] = field === "quantity" ? parseInt(value) : parseFloat(value);
    setCart(newCart);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  };

  const handlePrintReceipt = (transaction: any) => {
    setSelectedTransaction(transaction);
    setReceiptDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to continue");
        return;
      }

      const total = calculateTotal();

      const transactionData = {
        type: formData.type,
        payment_mode: formData.payment_mode,
        cashier_id: user.id,
        total_amount: total,
        discount: 0,
        tax: 0,
      };

      transactionSchema.parse({
        ...formData,
        items: cart,
      });

      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .insert([transactionData])
        .select()
        .single();

      if (transactionError) {
        console.error("Transaction error:", transactionError);
        throw transactionError;
      }

      const items = cart.map((item) => ({
        transaction_id: transaction.transaction_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from("transaction_items")
        .insert(items);

      if (itemsError) {
        console.error("Items error:", itemsError);
        throw itemsError;
      }

      // Update stock for sales
      if (formData.type === "sale") {
        for (const item of cart) {
          const product = products.find((p) => p.product_id === item.product_id);
          if (product) {
            const { error: stockError } = await supabase
              .from("products")
              .update({ stock_quantity: product.stock_quantity - item.quantity })
              .eq("product_id", item.product_id);
            
            if (stockError) {
              console.error("Stock update error:", stockError);
            }
          }
        }
      } else if (formData.type === "purchase") {
        // Increase stock for purchases
        for (const item of cart) {
          const product = products.find((p) => p.product_id === item.product_id);
          if (product) {
            const { error: stockError } = await supabase
              .from("products")
              .update({ stock_quantity: product.stock_quantity + item.quantity })
              .eq("product_id", item.product_id);
            
            if (stockError) {
              console.error("Stock update error:", stockError);
            }
          }
        }
      }

      toast.success("Transaction completed successfully");
      setDialogOpen(false);
      setCart([]);
      fetchTransactions();
      fetchProducts();
    } catch (error: any) {
      console.error("Transaction submission error:", error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to complete transaction");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Transactions</h1>
          <p className="text-muted-foreground">Record sales and purchases</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <ShoppingCart className="mr-2 h-4 w-4" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Transaction Type</Label>
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
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="purchase">Purchase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              </div>

              <div className="space-y-2">
                <Label>Add Product</Label>
                <Select onValueChange={addToCart}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.product_id} value={product.product_id}>
                        {product.name} - Stock: {product.stock_quantity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {cart.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Cart Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cart.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{item.product_name}</p>
                            <div className="flex gap-3 mt-2">
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateCartItem(index, "quantity", e.target.value)
                                }
                                className="w-24"
                              />
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unit_price}
                                onChange={(e) =>
                                  updateCartItem(index, "unit_price", e.target.value)
                                }
                                className="w-32"
                              />
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {(item.quantity * item.unit_price).toLocaleString()} UGX
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(index)}
                              className="mt-2"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center font-bold text-lg">
                          <span>Total:</span>
                          <span>{calculateTotal().toLocaleString()} UGX</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button type="submit" className="w-full" disabled={loading || cart.length === 0}>
                {loading ? "Processing..." : "Complete Transaction"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.transaction_id}>
                      <TableCell>
                        {new Date(transaction.date_time).toLocaleString()}
                      </TableCell>
                      <TableCell className="capitalize">{transaction.type}</TableCell>
                      <TableCell className="uppercase">{transaction.payment_mode}</TableCell>
                      <TableCell className="text-right font-medium">
                        {parseFloat(transaction.total_amount).toLocaleString()} UGX
                      </TableCell>
                      <TableCell>
                        {transaction.transaction_items?.length || 0} item(s)
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePrintReceipt(transaction)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction Receipt</DialogTitle>
          </DialogHeader>
          <Receipt
            transaction={selectedTransaction}
            onClose={() => setReceiptDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

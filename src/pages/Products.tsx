import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { PackagePlus, Pencil, Trash2, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().max(50).optional(),
  barcode: z.string().max(50).optional(),
  unit_price_buy: z.number().min(0, "Must be positive"),
  unit_price_sell: z.number().min(0, "Must be positive"),
  stock_quantity: z.number().int().min(0, "Must be positive"),
  supplier_info: z.string().optional(),
});

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    barcode: "",
    unit_price_buy: "",
    unit_price_sell: "",
    stock_quantity: "",
    supplier_info: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error loading products");
      return;
    }

    setProducts(data || []);
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

      const data = {
        name: formData.name.trim(),
        category: formData.category.trim() || null,
        barcode: formData.barcode.trim() || null,
        unit_price_buy: parseFloat(formData.unit_price_buy),
        unit_price_sell: parseFloat(formData.unit_price_sell),
        stock_quantity: parseInt(formData.stock_quantity),
        supplier_info: formData.supplier_info.trim() || null,
      };

      productSchema.parse(data);

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(data)
          .eq("product_id", editingProduct.product_id);

        if (error) {
          console.error("Update error:", error);
          toast.error(`Failed to update: ${error.message}`);
          throw error;
        }
        toast.success("Product updated successfully");
      } else {
        const { error } = await supabase.from("products").insert([data]);

        if (error) {
          console.error("Insert error:", error);
          toast.error(`Failed to add product: ${error.message}`);
          throw error;
        }
        toast.success("Product added successfully");
      }

      setDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error("Form submission error:", error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to save product");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category || "",
      barcode: product.barcode || "",
      unit_price_buy: product.unit_price_buy.toString(),
      unit_price_sell: product.unit_price_sell.toString(),
      stock_quantity: product.stock_quantity.toString(),
      supplier_info: product.supplier_info || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("product_id", productId);

    if (error) {
      toast.error("Failed to delete product");
      return;
    }

    toast.success("Product deleted successfully");
    fetchProducts();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      barcode: "",
      unit_price_buy: "",
      unit_price_sell: "",
      stock_quantity: "",
      supplier_info: "",
    });
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <PackagePlus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
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
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    maxLength={50}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <div className="relative">
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) =>
                        setFormData({ ...formData, barcode: e.target.value })
                      }
                      maxLength={50}
                    />
                    <ScanLine className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, stock_quantity: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyPrice">Buying Price (UGX) *</Label>
                  <Input
                    id="buyPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unit_price_buy}
                    onChange={(e) =>
                      setFormData({ ...formData, unit_price_buy: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellPrice">Selling Price (UGX) *</Label>
                  <Input
                    id="sellPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unit_price_sell}
                    onChange={(e) =>
                      setFormData({ ...formData, unit_price_sell: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier Info</Label>
                <Textarea
                  id="supplier"
                  value={formData.supplier_info}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier_info: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Buy Price</TableHead>
                  <TableHead className="text-right">Sell Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No products found. Add your first product to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.product_id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category || "-"}</TableCell>
                      <TableCell>{product.barcode || "-"}</TableCell>
                      <TableCell className="text-right">{product.stock_quantity}</TableCell>
                      <TableCell className="text-right">
                        {parseFloat(product.unit_price_buy).toLocaleString()} UGX
                      </TableCell>
                      <TableCell className="text-right">
                        {parseFloat(product.unit_price_sell).toLocaleString()} UGX
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.product_id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
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

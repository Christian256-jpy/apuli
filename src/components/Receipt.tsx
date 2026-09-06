import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface ReceiptProps {
  transaction: any;
  onClose?: () => void;
}

export default function Receipt({ transaction, onClose }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    // Add print styles
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        #receipt-content, #receipt-content * {
          visibility: visible;
        }
        #receipt-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!transaction) return null;

  const total = parseFloat(transaction.total_amount || 0);
  const items = transaction.transaction_items || [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="no-print mb-4 flex gap-2">
        <Button onClick={handlePrint} className="flex-1">
          <Printer className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
        {onClose && (
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        )}
      </div>

      <div
        id="receipt-content"
        ref={receiptRef}
        className="bg-background border border-border rounded-lg p-8 shadow-lg"
      >
        <div className="text-center mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-bold mb-2">BIBIYANO</h1>
          <p className="text-muted-foreground">Business Management System</p>
          <p className="text-sm text-muted-foreground mt-2">
            Kampala, Uganda | Tel: +256-781987735
          </p>
        </div>

        <div className="mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Receipt #:</span>
            <span className="font-mono text-sm">
              {transaction.transaction_id?.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span>{new Date(transaction.date_time).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="capitalize font-medium">{transaction.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Method:</span>
            <span className="uppercase">{transaction.payment_mode}</span>
          </div>
        </div>

        <div className="border-t border-b border-border py-4 mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2">Item</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, index: number) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-3">{item.products?.name || "Product"}</td>
                  <td className="text-center py-3">{item.quantity}</td>
                  <td className="text-right py-3">
                    {parseFloat(item.unit_price).toLocaleString()} UGX
                  </td>
                  <td className="text-right py-3 font-medium">
                    {(item.quantity * parseFloat(item.unit_price)).toLocaleString()} UGX
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2 mb-8">
          {transaction.discount && parseFloat(transaction.discount) > 0 && (
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-{parseFloat(transaction.discount).toLocaleString()} UGX</span>
            </div>
          )}
          {transaction.tax && parseFloat(transaction.tax) > 0 && (
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{parseFloat(transaction.tax).toLocaleString()} UGX</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold pt-2 border-t border-border">
            <span>TOTAL:</span>
            <span>{total.toLocaleString()} UGX</span>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground border-t border-border pt-6">
          <p className="mb-2">Thank you for your business!</p>
          <p>This receipt was generated on {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

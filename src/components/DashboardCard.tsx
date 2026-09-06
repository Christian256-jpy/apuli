import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "success" | "warning";
  className?: string;
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        "p-6 hover:shadow-[var(--shadow-elevated)] transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-sm font-medium",
                variant === "success" && "text-success",
                variant === "warning" && "text-warning",
                variant === "default" && "text-muted-foreground"
              )}
            >
              {trend}
            </p>
          )}
        </div>
        <div
          className={cn(
            "rounded-xl p-3",
            variant === "success" && "bg-success/10",
            variant === "warning" && "bg-warning/10",
            variant === "default" && "bg-primary/10"
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6",
              variant === "success" && "text-success",
              variant === "warning" && "text-warning",
              variant === "default" && "text-primary"
            )}
          />
        </div>
      </div>
    </Card>
  );
}

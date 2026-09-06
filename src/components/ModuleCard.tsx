import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "primary" | "success" | "warning";
  onClick?: () => void;
}

export function ModuleCard({
  title,
  description,
  icon: Icon,
  color,
  onClick,
}: ModuleCardProps) {
  return (
    <Card className="group p-6 hover:shadow-[var(--shadow-elevated)] transition-all hover:-translate-y-1 cursor-pointer" onClick={onClick}>
      <div className="flex flex-col h-full">
        <div
          className={cn(
            "rounded-xl p-3 w-fit mb-4",
            color === "primary" && "bg-primary/10",
            color === "success" && "bg-success/10",
            color === "warning" && "bg-warning/10"
          )}
        >
          <Icon
            className={cn(
              "h-7 w-7",
              color === "primary" && "text-primary",
              color === "success" && "text-success",
              color === "warning" && "text-warning"
            )}
          />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 flex-grow">{description}</p>
        <Button
          variant="ghost"
          className="w-fit px-0 group-hover:gap-2 transition-all"
        >
          Learn More
          <ArrowRight className="h-4 w-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
        </Button>
      </div>
    </Card>
  );
}

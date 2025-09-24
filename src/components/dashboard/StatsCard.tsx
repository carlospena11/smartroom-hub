import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "secondary" | "tertiary";
}

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  variant = "default" 
}: StatsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-primary text-primary-foreground";
      case "secondary":
        return "bg-gradient-secondary text-secondary-foreground";
      case "tertiary":
        return "bg-tertiary text-tertiary-foreground";
      default:
        return "bg-card text-card-foreground border border-border";
    }
  };

  return (
    <Card className={cn(
      "shadow-card hover:shadow-elegant transition-smooth",
      getVariantStyles()
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className={cn(
              "text-sm font-medium",
              variant === "default" ? "text-muted-foreground" : "opacity-90"
            )}>
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              {trend && (
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  trend.isPositive 
                    ? "bg-tertiary/20 text-tertiary" 
                    : "bg-destructive/20 text-destructive"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className={cn(
                "text-sm",
                variant === "default" ? "text-muted-foreground" : "opacity-75"
              )}>
                {description}
              </p>
            )}
          </div>
          <div className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center",
            variant === "default" 
              ? "bg-primary/10 text-primary" 
              : "bg-white/20"
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
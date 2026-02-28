import { ReactNode } from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: number;
    trendLabel?: string;
    color?: "navy" | "teal" | "amber" | "emerald" | "rose";
    suffix?: string;
}

const colorMap = {
    navy: {
        bg: "bg-[#20376b]/8",
        icon: "text-[#20376b]",
        text: "text-[#20376b]",
    },
    teal: {
        bg: "bg-teal-50",
        icon: "text-teal-600",
        text: "text-teal-700",
    },
    amber: {
        bg: "bg-amber-50",
        icon: "text-amber-600",
        text: "text-amber-700",
    },
    emerald: {
        bg: "bg-emerald-50",
        icon: "text-emerald-600",
        text: "text-emerald-700",
    },
    rose: {
        bg: "bg-rose-50",
        icon: "text-rose-600",
        text: "text-rose-700",
    },
};

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    trendLabel,
    color = "navy",
    suffix,
}: StatCardProps) {
    const colors = colorMap[color];

    const TrendIcon =
        trend === undefined || trend === 0
            ? Minus
            : trend > 0
                ? TrendingUp
                : TrendingDown;

    const trendColor =
        trend === undefined || trend === 0
            ? "text-slate-500"
            : trend > 0
                ? "text-emerald-600"
                : "text-red-500";

    return (
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            {title}
                        </p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
                            {suffix && (
                                <span className="text-sm font-medium text-slate-400">{suffix}</span>
                            )}
                        </div>
                        {(trend !== undefined || description) && (
                            <div className="flex items-center gap-1">
                                {trend !== undefined && (
                                    <>
                                        <TrendIcon className={cn("h-3 w-3", trendColor)} />
                                        <span className={cn("text-xs font-medium", trendColor)}>
                                            {Math.abs(trend)}%
                                        </span>
                                    </>
                                )}
                                {trendLabel && (
                                    <span className="text-[11px] text-slate-400">{trendLabel}</span>
                                )}
                                {description && !trendLabel && (
                                    <span className="text-[11px] text-slate-500">{description}</span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={cn("rounded-lg p-2.5 ml-3 shrink-0", colors.bg)}>
                        <Icon className={cn("h-5 w-5", colors.icon)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

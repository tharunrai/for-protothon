"use client";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Area,
    AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = ["#20376b", "#0d9488", "#d97706", "#059669", "#64748b", "#be185d"];

interface ChartWrapperProps {
    title: string;
    description?: string;
    className?: string;
    children: React.ReactNode;
}

export function ChartWrapper({ title, description, className, children }: ChartWrapperProps) {
    return (
        <Card className={cn("border-slate-200 shadow-sm", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-800">{title}</CardTitle>
                {description && <CardDescription className="text-xs text-slate-500">{description}</CardDescription>}
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

interface BarChartData {
    name: string;
    [key: string]: string | number;
}

interface CustomBarChartProps {
    data: BarChartData[];
    bars: { key: string; label: string; color?: string }[];
    height?: number;
    xKey?: string;
}

export function CustomBarChart({ data, bars, height = 280, xKey = "name" }: CustomBarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    cursor={{ fill: "#f8fafc" }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {bars.map((bar, i) => (
                    <Bar key={bar.key} dataKey={bar.key} name={bar.label} fill={bar.color ?? COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}

interface PieChartData {
    name: string;
    value: number;
}

interface CustomPieChartProps {
    data: PieChartData[];
    height?: number;
    innerRadius?: number;
}

export function CustomPieChart({ data, height = 280, innerRadius = 60 }: CustomPieChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={innerRadius + 55}
                    paddingAngle={3}
                    dataKey="value"
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                />
                <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ fontSize: 11, lineHeight: "24px" }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

interface AreaChartData {
    name: string;
    [key: string]: string | number;
}

interface CustomAreaChartProps {
    data: AreaChartData[];
    areas: { key: string; label: string; color?: string }[];
    height?: number;
    xKey?: string;
}

export function CustomAreaChart({ data, areas, height = 280, xKey = "name" }: CustomAreaChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <defs>
                    {areas.map((area, i) => (
                        <linearGradient key={area.key} id={`gradient-${area.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={area.color ?? COLORS[i % COLORS.length]} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={area.color ?? COLORS[i % COLORS.length]} stopOpacity={0} />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {areas.map((area, i) => (
                    <Area
                        key={area.key}
                        type="monotone"
                        dataKey={area.key}
                        name={area.label}
                        stroke={area.color ?? COLORS[i % COLORS.length]}
                        fill={`url(#gradient-${area.key})`}
                        strokeWidth={2}
                    />
                ))}
            </AreaChart>
        </ResponsiveContainer>
    );
}

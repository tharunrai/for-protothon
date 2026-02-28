"use client";

import {
    Trophy,
    Clock,
    CheckCircle,
    XCircle,
    Star,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, StatusBadge, CategoryBadge, Column } from "@/components/shared/DataTable";
import { ChartWrapper, CustomPieChart } from "@/components/shared/ChartComponents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { currentStudent, myAchievements, categoryStats } from "@/lib/dummy-data";
import { Achievement } from "@/types";

const columns: Column<Achievement>[] = [
    {
        key: "title", label: "Achievement", sortable: true, render: (_, row) => (
            <div className="max-w-xs">
                <p className="text-xs font-medium text-slate-900 truncate">{row.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{row.date}</p>
            </div>
        )
    },
    { key: "category", label: "Category", render: (val) => <CategoryBadge category={String(val)} /> },
    {
        key: "points", label: "Points", sortable: true, render: (val) => (
            <span className="font-semibold text-[#20376b] text-xs">{String(val)} pts</span>
        )
    },
    { key: "status", label: "Status", render: (_, row) => <StatusBadge status={row.status} /> },
];

export default function StudentDashboard() {
    const totalPoints = myAchievements.reduce((s, a) => s + (a.status === "approved" ? a.points : 0), 0);
    const approved = myAchievements.filter((a) => a.status === "approved").length;
    const pending = myAchievements.filter((a) => a.status === "pending").length;
    const rejected = myAchievements.filter((a) => a.status === "rejected").length;

    const pieData = categoryStats.map((c) => ({ name: c.category, value: c.approved }));

    return (
        <DashboardLayout user={currentStudent} role="student" pendingCount={pending}>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">My Dashboard</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    Welcome back, {currentStudent.name.split(" ")[0]}! Here&apos;s your achievement summary.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard title="Total Points" value={totalPoints} icon={Star} color="navy" trend={12} trendLabel="vs last month" />
                <StatCard title="Approved" value={approved} icon={CheckCircle} color="emerald" trend={5} trendLabel="vs last month" />
                <StatCard title="Pending Review" value={pending} icon={Clock} color="amber" />
                <StatCard title="Rejected" value={rejected} icon={XCircle} color="rose" />
            </div>

            {/* Category Chart */}
            <div className="grid gap-5 lg:grid-cols-3 mb-6">
                <ChartWrapper title="By Category" description="Approved achievements per category">
                    <CustomPieChart data={pieData} height={240} innerRadius={50} />
                </ChartWrapper>
            </div>

            {/* Recent Achievements */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-slate-800">My Achievements</CardTitle>
                        <p className="text-xs text-slate-500 mt-0.5">All submitted achievements and their status</p>
                    </div>
                    <Badge className="bg-[#20376b]/10 text-[#20376b] border-[#20376b]/20 text-[10px]">
                        {myAchievements.length} Total
                    </Badge>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={myAchievements}
                        searchable
                        searchKey="title"
                        searchPlaceholder="Search achievements..."
                        pageSize={5}
                    />
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}

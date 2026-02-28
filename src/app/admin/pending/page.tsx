"use client";

import {
    Users,
    CheckCircle,
    TrendingUp,
    Clock,
    Check,
    X,
    Eye,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, StatusBadge, CategoryBadge, Column } from "@/components/shared/DataTable";
import { ChartWrapper, CustomBarChart } from "@/components/shared/ChartComponents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    currentAdmin,
    achievements,
    pendingAchievements,
    students,
    monthlyStats,
} from "@/lib/dummy-data";
import { Achievement } from "@/types";

const approvalColumns: Column<Achievement>[] = [
    {
        key: "studentName", label: "Student", sortable: true, render: (_, row) => (
            <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-emerald-50 text-emerald-700 text-[9px] font-semibold">
                        {row.studentName.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-xs font-medium text-slate-900">{row.studentName}</p>
                    <p className="text-[10px] text-slate-400">{row.department.split(" ")[0]}</p>
                </div>
            </div>
        )
    },
    {
        key: "title", label: "Achievement", render: (_, row) => (
            <div className="max-w-[200px]">
                <p className="text-xs font-medium text-slate-900 truncate">{row.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{row.date}</p>
            </div>
        )
    },
    { key: "category", label: "Category", render: (val) => <CategoryBadge category={String(val)} /> },
    {
        key: "points", label: "Points", render: (val) => (
            <span className="text-xs font-semibold text-emerald-700">{String(val)} pts</span>
        )
    },
    { key: "status", label: "Status", render: (_, row) => <StatusBadge status={row.status} /> },
    {
        key: "id", label: "Action", render: (_, row) => (
            <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-slate-700">
                    <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" className="h-7 w-7 bg-emerald-500 hover:bg-emerald-600 text-white">
                    <Check className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="outline" className="h-7 w-7 border-red-200 text-red-500 hover:bg-red-50">
                    <X className="h-3.5 w-3.5" />
                </Button>
            </div>
        )
    },
];

const barDataReview = monthlyStats.slice(-6).map((m) => ({
    name: m.month,
    Approved: m.approved,
    Pending: m.pending,
    Rejected: m.rejected,
}));

const menteeStats = students.slice(0, 4).map((s) => ({
    ...s,
    achievementCount: achievements.filter((a) => a.studentId === s.id).length,
    approved: achievements.filter((a) => a.studentId === s.id && a.status === "approved").length,
}));

export default function PendingApprovalsPage() {
    const totalReviewed = achievements.filter((a) => a.status !== "pending").length;

    return (
        <DashboardLayout user={currentAdmin} role="admin" pendingCount={pendingAchievements.length}>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Pending Approvals</h1>
                <p className="text-sm text-slate-500 mt-0.5">Review and act on student achievement submissions.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard title="Awaiting Review" value={pendingAchievements.length} icon={Clock} color="amber" />
                <StatCard title="Reviewed This Month" value={totalReviewed} icon={CheckCircle} color="emerald" trend={8} trendLabel="vs last month" />
                <StatCard title="Students Monitored" value={students.length} icon={Users} color="navy" />
                <StatCard title="Approval Rate" value="91" suffix="%" icon={TrendingUp} color="teal" trend={3} trendLabel="vs last month" />
            </div>

            <div className="grid gap-5 lg:grid-cols-3 mb-6">
                <ChartWrapper title="Monthly Review Activity" description="Approval decisions per month" className="lg:col-span-2">
                    <CustomBarChart
                        data={barDataReview}
                        bars={[
                            { key: "Approved", label: "Approved", color: "#10b981" },
                            { key: "Pending", label: "Pending", color: "#f59e0b" },
                            { key: "Rejected", label: "Rejected", color: "#ef4444" },
                        ]}
                    />
                </ChartWrapper>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-slate-800">Student Progress</CardTitle>
                        <p className="text-xs text-slate-500">Achievement completion rate</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {menteeStats.map((s) => {
                            const rate = s.achievementCount > 0 ? Math.round((s.approved / s.achievementCount) * 100) : 0;
                            return (
                                <div key={s.id} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="bg-emerald-50 text-emerald-700 text-[9px] font-semibold">
                                                    {s.name.split(" ").map((n: string) => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs font-medium text-slate-700">{s.name.split(" ")[0]}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-500">{rate}%</span>
                                    </div>
                                    <Progress value={rate} className="h-1.5" />
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-slate-800">All Achievement Submissions</CardTitle>
                    <p className="text-xs text-slate-500">Review and approve or reject student submissions</p>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={approvalColumns}
                        data={achievements}
                        searchable
                        searchKey="studentName"
                        searchPlaceholder="Search by student name..."
                    />
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}

"use client";

import { useMemo } from "react";
import { Users, Trophy, TrendingUp, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, StatusBadge, CategoryBadge, Column } from "@/components/shared/DataTable";
import { ChartWrapper, CustomBarChart, CustomPieChart, CustomAreaChart } from "@/components/shared/ChartComponents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Achievement, DepartmentStats } from "@/types";
import {
    useAdminAuth,
    useAllAchievements,
    computeCategoryStats,
    computeMonthlyStats,
    computeDepartmentStats,
    computeTopStudents,
    profileToUser,
} from "@/lib/hooks";

const achievementColumns: Column<Achievement>[] = [
    {
        key: "studentName", label: "Student", sortable: true, render: (_, row) => (
            <div className="flex items-center gap-2.5">
                <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-[#20376b]/10 text-[#20376b] text-[9px] font-semibold">
                        {row.studentName.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-slate-900">{row.studentName}</span>
            </div>
        )
    },
    { key: "title", label: "Achievement", sortable: true, render: (val) => <span className="text-xs text-slate-700">{String(val)}</span> },
    { key: "category", label: "Category", render: (val) => <CategoryBadge category={String(val)} /> },
    { key: "department", label: "Dept.", sortable: true, render: (val) => <span className="text-xs text-slate-500">{String(val).split(" ")[0]}</span> },
    { key: "points", label: "Pts", sortable: true, render: (val) => <span className="text-xs font-semibold text-[#20376b]">{String(val)}</span> },
    { key: "status", label: "Status", render: (val) => <StatusBadge status={val as "pending" | "approved" | "rejected"} /> },
];

const deptColumns: Column<DepartmentStats>[] = [
    { key: "department", label: "Department", sortable: true, render: (val) => <span className="text-xs font-medium text-slate-800">{String(val)}</span> },
    { key: "totalStudents", label: "Students", sortable: true, render: (val) => <span className="text-xs text-slate-600">{String(val)}</span> },
    { key: "totalAchievements", label: "Submissions", sortable: true, render: (val) => <span className="text-xs text-slate-600">{String(val)}</span> },
    { key: "approvedAchievements", label: "Approved", sortable: true, render: (val) => <span className="text-xs text-emerald-600 font-medium">{String(val)}</span> },
    { key: "totalPoints", label: "Total Pts", sortable: true, render: (val) => <span className="text-xs font-semibold text-[#20376b]">{String(val)}</span> },
];

export default function AdminDashboard() {
    const { admin, loading: loadingAuth } = useAdminAuth();
    const { achievements, loading: loadingData } = useAllAchievements();

    const categoryStats = useMemo(() => computeCategoryStats(achievements), [achievements]);
    const monthlyStats = useMemo(() => computeMonthlyStats(achievements), [achievements]);
    const departmentStats = useMemo(() => computeDepartmentStats(achievements), [achievements]);
    const topStudents = useMemo(() => computeTopStudents(achievements), [achievements]);

    const pending = achievements.filter((a) => a.status === "pending");
    const approved = achievements.filter((a) => a.status === "approved");
    const approvalRate = achievements.length > 0 ? Math.round((approved.length / achievements.length) * 100) : 0;
    const uniqueStudents = new Set(achievements.map((a) => a.studentId)).size;

    const pieData = categoryStats.map((c) => ({ name: c.category, value: c.count }));
    const areaData = monthlyStats.map((m) => ({ name: m.month, Total: m.total, Approved: m.approved, Pending: m.pending }));
    const barDataDept = departmentStats.map((d) => ({
        name: d.department.split(" ")[0],
        Points: d.totalPoints,
        "Achievements x30": d.totalAchievements * 30,
    }));

    if (loadingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 rounded-full border-2 border-[#20376b] border-t-transparent animate-spin" />
                    <p className="text-sm text-slate-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!admin) return null;

    return (
        <DashboardLayout user={profileToUser(admin)} role="admin" pendingCount={pending.length}>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-sm text-slate-500 mt-0.5">Overview of student achievements and platform activity.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard title="Active Students" value={uniqueStudents} icon={Users} color="navy" />
                <StatCard title="Total Achievements" value={achievements.length} icon={Trophy} color="teal" />
                <StatCard title="Pending Approvals" value={pending.length} icon={Clock} color="amber" />
                <StatCard title="Approval Rate" value={`${approvalRate}%`} icon={TrendingUp} color="emerald" />
            </div>

            <div className="grid gap-5 lg:grid-cols-3 mb-6">
                <div className="lg:col-span-2">
                    <ChartWrapper title="Monthly Submission Trend" description="Total, approved, and pending over time">
                        <CustomAreaChart
                            data={areaData}
                            areas={[
                                { key: "Total", label: "Total", color: "#20376b" },
                                { key: "Approved", label: "Approved", color: "#10b981" },
                                { key: "Pending", label: "Pending", color: "#f59e0b" },
                            ]}
                            height={240}
                        />
                    </ChartWrapper>
                </div>
                <ChartWrapper title="Category Distribution" description="Approved achievements per category">
                    <CustomPieChart data={pieData} height={240} innerRadius={50} />
                </ChartWrapper>
            </div>

            <div className="grid gap-5 lg:grid-cols-3 mb-6">
                <div className="lg:col-span-2">
                    <ChartWrapper title="Department Performance" description="Points and achievements by department">
                        <CustomBarChart
                            data={barDataDept}
                            bars={[
                                { key: "Points", label: "Points", color: "#20376b" },
                                { key: "Achievements x30", label: "Achievements x30", color: "#0ea5e9" },
                            ]}
                            height={240}
                        />
                    </ChartWrapper>
                </div>
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-slate-800">Top Students</CardTitle>
                        <p className="text-xs text-slate-500">Highest achievement points</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {topStudents.slice(0, 5).map((s, i) => (
                            <div key={s.id} className="flex items-center gap-2.5">
                                <span className="text-[10px] font-bold text-slate-400 w-5 text-right">
                                    {i === 0 ? "1st" : i === 1 ? "2nd" : i === 2 ? "3rd" : `#${i + 1}`}
                                </span>
                                <Avatar className="h-7 w-7">
                                    <AvatarFallback className="bg-[#20376b]/10 text-[#20376b] text-[9px] font-semibold">
                                        {s.name.split(" ").map((n: string) => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-slate-900 truncate">{s.name}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{s.department.split(" ")[0]}</p>
                                </div>
                                <span className="text-xs font-bold text-[#20376b]">{s.totalPoints}</span>
                            </div>
                        ))}
                        {topStudents.length === 0 && (
                            <p className="text-xs text-slate-400 text-center py-4">No data yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-200 shadow-sm mb-6">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-800">Department Statistics</CardTitle>
                    <p className="text-xs text-slate-500">Achievement breakdown by department</p>
                </CardHeader>
                <CardContent>
                    <DataTable columns={deptColumns} data={departmentStats} pagination={false} />
                </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-800">All Achievement Submissions</CardTitle>
                    <p className="text-xs text-slate-500">Complete list of student submissions</p>
                </CardHeader>
                <CardContent>
                    {loadingData ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />)}
                        </div>
                    ) : (
                        <DataTable
                            columns={achievementColumns}
                            data={achievements}
                            searchable
                            searchKey="studentName"
                            searchPlaceholder="Search by student name..."
                        />
                    )}
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}

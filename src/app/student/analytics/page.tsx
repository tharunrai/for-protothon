"use client";

import { useMemo, useState } from "react";
import {
    useStudentAuth,
    useStudentAchievements,
    useAllAchievements,
    computeCategoryStats,
    computeMonthlyStats,
    computeDepartmentStats,
    profileToUser,
} from "@/lib/hooks";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    CustomBarChart,
    CustomPieChart,
    CustomAreaChart,
} from "@/components/shared/ChartComponents";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CategoryStats, DepartmentStats } from "@/types";

const categoryColors: Record<string, string> = {
    Academic: "#3b82f6",
    Research: "#8b5cf6",
    Sports: "#10b981",
    Cultural: "#f59e0b",
    "Co-Curricular": "#ef4444",
    Professional: "#6366f1",
};

export default function StudentAnalyticsPage() {
    const { student, loading: authLoading } = useStudentAuth();
    const { achievements: myAchievements, loading: myLoading } = useStudentAchievements(student?.uid);
    const { achievements: allAchievements, loading: allLoading } = useAllAchievements();
    const [tab, setTab] = useState("overview");

    const loading = authLoading || myLoading || allLoading;

    // Student-specific stats
    const myCatStats = useMemo(() => computeCategoryStats(myAchievements), [myAchievements]);
    const myMonthlyStats = useMemo(() => computeMonthlyStats(myAchievements), [myAchievements]);

    // Department comparison (from all achievements)
    const deptStats = useMemo(() => computeDepartmentStats(allAchievements), [allAchievements]);

    // Pie data for categories
    const pieData = useMemo(
        () =>
            myCatStats
                .filter((c) => c.count > 0)
                .map((c) => ({
                    name: c.category,
                    value: c.count,
                    color: categoryColors[c.category] || "#94a3b8",
                })),
        [myCatStats]
    );

    // Bar data for category points
    const catBarData = useMemo(
        () =>
            myCatStats.map((c) => ({
                name: c.category,
                Points: c.points,
                Count: c.count,
            })),
        [myCatStats]
    );

    // Area data for monthly trend
    const areaData = useMemo(
        () =>
            myMonthlyStats.map((m) => ({
                name: m.month,
                Total: m.total,
                Approved: m.approved,
                Pending: m.pending,
            })),
        [myMonthlyStats]
    );

    // Department bar data
    const deptBarData = useMemo(
        () =>
            deptStats.map((d) => ({
                name: d.department.length > 12 ? d.department.slice(0, 12) + "…" : d.department,
                Points: d.totalPoints,
                Achievements: d.totalAchievements,
            })),
        [deptStats]
    );

    // Summary numbers
    const summary = useMemo(() => {
        const approved = myAchievements.filter((a) => a.status === "approved");
        return {
            total: myAchievements.length,
            approved: approved.length,
            points: approved.reduce((s, a) => s + a.points, 0),
            categories: new Set(myAchievements.map((a) => a.category)).size,
        };
    }, [myAchievements]);

    const catColumns: Column<CategoryStats>[] = [
        { key: "category", label: "Category" },
        { key: "count", label: "Total" },
        {
            key: "approved",
            label: "Approved",
            render: (v) => <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">{String(v)}</Badge>,
        },
        {
            key: "pending",
            label: "Pending",
            render: (v) => <Badge className="bg-amber-100 text-amber-700 text-[10px]">{String(v)}</Badge>,
        },
        { key: "points", label: "Points" },
    ];

    const deptColumns: Column<DepartmentStats>[] = [
        { key: "department", label: "Department" },
        { key: "totalStudents", label: "Students" },
        { key: "totalAchievements", label: "Achievements" },
        { key: "approvedAchievements", label: "Approved" },
        { key: "totalPoints", label: "Points" },
    ];

    if (loading || !student) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#20376b] border-t-transparent" />
            </div>
        );
    }

    return (
        <DashboardLayout user={profileToUser(student)} role="student">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Analytics</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Detailed insights into your achievements and performance.
                    </p>
                </div>

                {/* Quick summary chips */}
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: "Total Submissions", value: summary.total },
                        { label: "Approved", value: summary.approved },
                        { label: "Total Points", value: summary.points },
                        { label: "Categories", value: summary.categories },
                    ].map((s) => (
                        <div key={s.label} className="bg-white border border-slate-200 rounded-lg px-4 py-2">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{s.label}</p>
                            <p className="text-lg font-bold text-slate-900">{s.value}</p>
                        </div>
                    ))}
                </div>

                <Tabs value={tab} onValueChange={setTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                        <TabsTrigger value="departments">Department Comparison</TabsTrigger>
                    </TabsList>

                    {/* ── Overview tab ─────────────────────────────────────── */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl border border-slate-200 p-5">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Trend</h3>
                                {areaData.length > 0 ? (
                                    <CustomAreaChart data={areaData} xKey="name" areas={[
                                        { key: "Total", label: "Total", color: "#3b82f6" },
                                        { key: "Approved", label: "Approved", color: "#10b981" },
                                        { key: "Pending", label: "Pending", color: "#f59e0b" },
                                    ]} height={280} />
                                ) : (
                                    <p className="text-sm text-slate-400 text-center py-16">No data yet</p>
                                )}
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-5">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4">Category Distribution</h3>
                                {pieData.length > 0 ? (
                                    <CustomPieChart data={pieData} height={280} />
                                ) : (
                                    <p className="text-sm text-slate-400 text-center py-16">No data yet</p>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* ── Categories tab ───────────────────────────────────── */}
                    <TabsContent value="categories" className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4">Points by Category</h3>
                            <CustomBarChart data={catBarData} xKey="name" bars={[
                                { key: "Points", label: "Points", color: "#3b82f6" },
                                { key: "Count", label: "Count", color: "#94a3b8" },
                            ]} height={300} />
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4">Category Breakdown</h3>
                            <DataTable columns={catColumns} data={myCatStats} />
                        </div>
                    </TabsContent>

                    {/* ── Department Comparison tab ────────────────────────── */}
                    <TabsContent value="departments" className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4">Department Performance</h3>
                            {deptBarData.length > 0 ? (
                                <CustomBarChart data={deptBarData} xKey="name" bars={[
                                    { key: "Points", label: "Points", color: "#6366f1" },
                                    { key: "Achievements", label: "Achievements", color: "#94a3b8" },
                                ]} height={300} />
                            ) : (
                                <p className="text-sm text-slate-400 text-center py-16">No data yet</p>
                            )}
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4">All Departments</h3>
                            <DataTable columns={deptColumns} data={deptStats} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}

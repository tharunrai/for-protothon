"use client";
export const dynamic = "force-dynamic";

import { useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    ChartWrapper,
    CustomBarChart,
    CustomPieChart,
    CustomAreaChart,
} from "@/components/shared/ChartComponents";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, TrendingUp, Trophy, Users } from "lucide-react";
import {
    useAdminAuth,
    useAllAchievements,
    computeCategoryStats,
    computeMonthlyStats,
    computeDepartmentStats,
    profileToUser,
} from "@/lib/hooks";

export default function AdminAnalyticsPage() {
    const { admin, loading: loadingAuth } = useAdminAuth();
    const { achievements, loading: loadingData } = useAllAchievements();

    const categoryStats = useMemo(() => computeCategoryStats(achievements), [achievements]);
    const monthlyStats = useMemo(() => computeMonthlyStats(achievements), [achievements]);
    const departmentStats = useMemo(() => computeDepartmentStats(achievements), [achievements]);

    const categoryBarData = categoryStats.map((c) => ({
        name: c.category.split(" ")[0],
        Approved: c.approved,
        Pending: c.pending,
        Rejected: c.rejected,
    }));

    const monthlyAreaData = monthlyStats.map((m) => ({
        name: m.month,
        total: m.total,
        approved: m.approved,
        pending: m.pending,
    }));

    const deptBarData = departmentStats.map((d) => ({
        name: d.department.split(" ")[0],
        Points: d.totalPoints,
        Students: d.totalStudents,
    }));

    const statusPieData = [
        { name: "Approved", value: categoryStats.reduce((s, c) => s + c.approved, 0) },
        { name: "Pending", value: categoryStats.reduce((s, c) => s + c.pending, 0) },
        { name: "Rejected", value: categoryStats.reduce((s, c) => s + c.rejected, 0) },
    ].filter((d) => d.value > 0);

    const categoryPieData = categoryStats.map((c) => ({ name: c.category, value: c.count }));

    const totalPoints = categoryStats.reduce((s, c) => s + c.points, 0);
    const totalApproved = categoryStats.reduce((s, c) => s + c.approved, 0);
    const totalPending = categoryStats.reduce((s, c) => s + c.pending, 0);
    const uniqueStudents = new Set(achievements.map((a) => a.studentId)).size;

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
        <DashboardLayout user={profileToUser(admin)} role="admin">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
                <p className="text-sm text-slate-500 mt-0.5">System-wide visual insights across achievements, categories, and departments.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard title="Total Points Awarded" value={totalPoints.toLocaleString()} icon={Trophy} color="navy" />
                <StatCard title="Approved Achievements" value={totalApproved} icon={TrendingUp} color="emerald" />
                <StatCard title="Pending Review" value={totalPending} icon={BarChart2} color="amber" />
                <StatCard title="Active Students" value={uniqueStudents} icon={Users} color="teal" />
            </div>

            {loadingData ? (
                <div className="space-y-4">
                    {[1, 2].map((i) => <div key={i} className="h-64 bg-slate-100 rounded-lg animate-pulse" />)}
                </div>
            ) : (
                <Tabs defaultValue="overview">
                    <TabsList className="mb-6 bg-slate-100">
                        <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                        <TabsTrigger value="categories" className="text-xs">By Category</TabsTrigger>
                        <TabsTrigger value="departments" className="text-xs">By Department</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-5">
                        <div className="grid gap-5 lg:grid-cols-2">
                            <ChartWrapper title="Yearly Achievement Trend" description="Monthly submission and approval trends across the academic year">
                                <CustomAreaChart
                                    data={monthlyAreaData}
                                    areas={[
                                        { key: "total", label: "Total Submissions", color: "#20376b" },
                                        { key: "approved", label: "Approved", color: "#10b981" },
                                        { key: "pending", label: "Pending", color: "#d97706" },
                                    ]}
                                />
                            </ChartWrapper>
                            <ChartWrapper title="Status Distribution" description="Overall approval vs pending vs rejected">
                                <CustomPieChart data={statusPieData} height={280} innerRadius={65} />
                            </ChartWrapper>
                        </div>
                    </TabsContent>

                    <TabsContent value="categories" className="space-y-5">
                        <div className="grid gap-5 lg:grid-cols-2">
                            <ChartWrapper title="Category-wise Breakdown" description="Approved, pending, and rejected by category">
                                <CustomBarChart
                                    data={categoryBarData}
                                    bars={[
                                        { key: "Approved", label: "Approved", color: "#10b981" },
                                        { key: "Pending", label: "Pending", color: "#f59e0b" },
                                        { key: "Rejected", label: "Rejected", color: "#ef4444" },
                                    ]}
                                />
                            </ChartWrapper>
                            <ChartWrapper title="Category Share" description="Proportion of total achievements per category">
                                <CustomPieChart data={categoryPieData} height={280} innerRadius={55} />
                            </ChartWrapper>
                        </div>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-slate-800">Category Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg border border-slate-200 overflow-hidden">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                {["Category", "Total", "Approved", "Pending", "Rejected", "Points"].map((h) => (
                                                    <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {categoryStats.map((c) => (
                                                <tr key={c.category} className="hover:bg-slate-50">
                                                    <td className="px-4 py-2.5 font-medium text-slate-800">{c.category}</td>
                                                    <td className="px-4 py-2.5 text-slate-600">{c.count}</td>
                                                    <td className="px-4 py-2.5 text-emerald-700 font-semibold">{c.approved}</td>
                                                    <td className="px-4 py-2.5 text-amber-600">{c.pending}</td>
                                                    <td className="px-4 py-2.5 text-rose-600">{c.rejected}</td>
                                                    <td className="px-4 py-2.5 text-[#20376b] font-semibold">{c.points.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="departments" className="space-y-5">
                        <ChartWrapper title="Department Performance" description="Achievement points and student count by department">
                            <CustomBarChart
                                data={deptBarData}
                                bars={[
                                    { key: "Points", label: "Points", color: "#20376b" },
                                    { key: "Students", label: "Students", color: "#0d9488" },
                                ]}
                                height={300}
                            />
                        </ChartWrapper>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-slate-800">Department Summary Table</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg border border-slate-200 overflow-hidden">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                {["Department", "Students", "Total", "Approved", "Approval Rate", "Points"].map((h) => (
                                                    <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {departmentStats.map((d) => (
                                                <tr key={d.department} className="hover:bg-slate-50">
                                                    <td className="px-4 py-2.5 font-medium text-slate-800">{d.department}</td>
                                                    <td className="px-4 py-2.5 text-slate-600">{d.totalStudents}</td>
                                                    <td className="px-4 py-2.5 text-slate-600">{d.totalAchievements}</td>
                                                    <td className="px-4 py-2.5 text-emerald-700 font-semibold">{d.approvedAchievements}</td>
                                                    <td className="px-4 py-2.5 text-[#20376b]">
                                                        {d.totalAchievements > 0 ? Math.round((d.approvedAchievements / d.totalAchievements) * 100) : 0}%
                                                    </td>
                                                    <td className="px-4 py-2.5 text-[#20376b] font-semibold">{d.totalPoints.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}
        </DashboardLayout>
    );
}

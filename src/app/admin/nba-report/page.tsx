"use client";
export const dynamic = "force-dynamic";

import { useMemo, useState } from "react";
import { Printer, GraduationCap, Trophy, TrendingUp, CheckCircle, BookOpen } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, StatusBadge, CategoryBadge, Column } from "@/components/shared/DataTable";
import { ChartWrapper, CustomBarChart, CustomPieChart, CustomAreaChart } from "@/components/shared/ChartComponents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    useAdminAuth,
    useAllAchievements,
    computeCategoryStats,
    computeMonthlyStats,
    computeDepartmentStats,
    computeTopStudents,
    profileToUser,
} from "@/lib/hooks";
import { Achievement, CategoryStats, DepartmentStats, MonthlyStats, TopStudent } from "@/types";

// ── Achievement records table columns (index passed at render time) ───────────
const recordColumns: Column<Achievement>[] = [
    {
        key: "id", label: "Sr.", render: (_, _row, idx) => (
            <span className="text-[10px] text-slate-400 font-mono">{(idx ?? 0) + 1}</span>
        ),
    },
    {
        key: "studentName", label: "Student", sortable: true, render: (_, row) => (
            <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-[#20376b]/10 text-[#20376b] text-[8px] font-semibold">
                        {row.studentName.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-slate-900">{row.studentName}</span>
            </div>
        ),
    },
    {
        key: "department", label: "Dept.", render: (val) => (
            <span className="text-xs text-slate-500">{String(val).split(" ")[0]}</span>
        ),
    },
    {
        key: "title", label: "Achievement", render: (val) => (
            <span className="text-xs text-slate-700 max-w-[200px] block truncate">{String(val)}</span>
        ),
    },
    { key: "category", label: "Category", render: (val) => <CategoryBadge category={String(val)} /> },
    { key: "date", label: "Date", sortable: true, render: (val) => <span className="text-xs text-slate-500">{String(val)}</span> },
    {
        key: "points", label: "Points", sortable: true, render: (val) => (
            <span className="text-xs font-semibold text-[#20376b]">{String(val)}</span>
        ),
    },
    { key: "status", label: "Status", render: (_, row) => <StatusBadge status={row.status} /> },
    {
        key: "proof", label: "Proof", render: (val) => (
            val ? <span className="text-[10px] text-blue-600 underline truncate max-w-[100px] block">{String(val)}</span>
                : <span className="text-[10px] text-slate-300">--</span>
        ),
    },
];

// ── Print / Export PDF ────────────────────────────────────────
function handlePrintReport(
    academicYear: string,
    achievements: Achievement[],
    categoryStats: CategoryStats[],
    departmentStats: DepartmentStats[],
    monthlyStats: MonthlyStats[],
    topStudents: TopStudent[],
) {
    const totalAchievements = categoryStats.reduce((s, c) => s + c.count, 0);
    const totalApproved = categoryStats.reduce((s, c) => s + c.approved, 0);
    const totalPending = categoryStats.reduce((s, c) => s + c.pending, 0);
    const totalRejected = categoryStats.reduce((s, c) => s + c.rejected, 0);
    const totalPoints = categoryStats.reduce((s, c) => s + c.points, 0);
    const approvalRate = totalAchievements > 0 ? Math.round((totalApproved / totalAchievements) * 100) : 0;
    const totalStudents = new Set(achievements.map((a) => a.studentId)).size;

    const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    // Category summary rows
    const catRows = categoryStats
        .map((c) => `<tr><td>${c.category}</td><td class="num">${c.count}</td><td class="num">${c.approved}</td><td class="num">${c.pending}</td><td class="num">${c.rejected}</td><td class="num">${c.points}</td></tr>`)
        .join("");
    const catFooter = `<tr class="total"><td><strong>Total</strong></td><td class="num"><strong>${totalAchievements}</strong></td><td class="num"><strong>${totalApproved}</strong></td><td class="num"><strong>${totalPending}</strong></td><td class="num"><strong>${totalRejected}</strong></td><td class="num"><strong>${totalPoints}</strong></td></tr>`;

    // Department summary rows
    const deptRows = departmentStats
        .map((d) => {
            const rate = ((d.totalAchievements / d.totalStudents) * 100).toFixed(1);
            return `<tr><td>${d.department}</td><td class="num">${d.totalStudents}</td><td class="num">${d.totalAchievements}</td><td class="num">${d.approvedAchievements}</td><td class="num">${d.totalPoints}</td><td class="num">${rate}%</td></tr>`;
        })
        .join("");

    // Top students rows
    const topRows = topStudents
        .map((s, i) => `<tr><td class="num">${i + 1}</td><td>${s.name}</td><td>${s.department}</td><td class="num">${s.totalPoints}</td><td class="num">${s.totalAchievements}</td><td class="num">${s.approvedCount}</td></tr>`)
        .join("");

    // All achievements rows
    const achRows = achievements
        .map((a, i) => `<tr><td class="num">${i + 1}</td><td>${a.studentName}</td><td>${a.department.split(" ")[0]}</td><td>${a.title}</td><td>${a.category}</td><td>${a.date}</td><td class="num">${a.points}</td><td><span class="status-${a.status}">${a.status}</span></td><td>${a.proof || "--"}</td></tr>`)
        .join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>NBA Criterion 4 Report - ${academicYear}</title>
<style>
    @page { size: A4; margin: 20mm 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1e293b; line-height: 1.5; padding: 0; }
    .page-header { text-align: center; border-bottom: 3px double #20376b; padding-bottom: 12px; margin-bottom: 20px; }
    .page-header h1 { font-size: 18px; color: #20376b; margin-bottom: 2px; }
    .page-header h2 { font-size: 14px; color: #20376b; font-weight: 600; margin-bottom: 2px; }
    .page-header p { font-size: 11px; color: #64748b; }
    .section { margin-bottom: 24px; page-break-inside: avoid; }
    .section-title { font-size: 13px; font-weight: 700; color: #20376b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
    .summary-box { border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; text-align: center; }
    .summary-box .value { font-size: 20px; font-weight: 700; color: #20376b; }
    .summary-box .label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 10px; }
    th { background: #f1f5f9; color: #334155; font-weight: 600; text-align: left; padding: 6px 8px; border: 1px solid #e2e8f0; }
    td { padding: 5px 8px; border: 1px solid #e2e8f0; vertical-align: top; }
    tr:nth-child(even) { background: #f8fafc; }
    tr.total { background: #f1f5f9; font-weight: 600; }
    .num { text-align: right; }
    .status-approved { color: #059669; font-weight: 600; }
    .status-pending { color: #d97706; font-weight: 600; }
    .status-rejected { color: #dc2626; font-weight: 600; }
    .footer { text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 30px; }
    @media print {
        .no-print { display: none !important; }
        body { padding: 0; }
    }
</style>
</head>
<body>

<div class="page-header">
    <h1>Institution Name</h1>
    <h2>NBA Self-Assessment Report</h2>
    <h2>Criterion 4: Students' Performance and Outcomes</h2>
    <p>Academic Year: ${academicYear} &nbsp;|&nbsp; Generated on: ${dateStr}</p>
</div>

<!-- Executive Summary -->
<div class="section">
    <div class="section-title">Executive Summary</div>
    <div class="summary-grid">
        <div class="summary-box"><div class="value">${totalStudents.toLocaleString()}</div><div class="label">Total Students</div></div>
        <div class="summary-box"><div class="value">${totalAchievements}</div><div class="label">Total Achievements</div></div>
        <div class="summary-box"><div class="value">${totalApproved}</div><div class="label">Approved</div></div>
        <div class="summary-box"><div class="value">${approvalRate}%</div><div class="label">Approval Rate</div></div>
    </div>
</div>

<!-- Table 4.1 -->
<div class="section">
    <div class="section-title">Table 4.1: Category-wise Achievement Distribution</div>
    <table>
        <thead><tr><th>Category</th><th class="num">Total</th><th class="num">Approved</th><th class="num">Pending</th><th class="num">Rejected</th><th class="num">Points</th></tr></thead>
        <tbody>${catRows}${catFooter}</tbody>
    </table>
</div>

<!-- Table 4.2 -->
<div class="section" style="page-break-before: always;">
    <div class="section-title">Table 4.2: Department-wise Performance Summary</div>
    <table>
        <thead><tr><th>Department</th><th class="num">Students</th><th class="num">Total Achievements</th><th class="num">Approved</th><th class="num">Total Points</th><th class="num">Participation Rate</th></tr></thead>
        <tbody>${deptRows}</tbody>
    </table>
</div>

<!-- Table 4.3 -->
<div class="section">
    <div class="section-title">Table 4.3: Top Performing Students</div>
    <table>
        <thead><tr><th class="num">Rank</th><th>Student Name</th><th>Department</th><th class="num">Points</th><th class="num">Achievements</th><th class="num">Approved</th></tr></thead>
        <tbody>${topRows}</tbody>
    </table>
</div>

<!-- Annexure 4.1 -->
<div class="section" style="page-break-before: always;">
    <div class="section-title">Annexure 4.1: Complete Achievement Records for the Academic Year</div>
    <table>
        <thead><tr><th class="num">Sr.</th><th>Student</th><th>Dept.</th><th>Achievement</th><th>Category</th><th>Date</th><th class="num">Points</th><th>Status</th><th>Proof</th></tr></thead>
        <tbody>${achRows}</tbody>
    </table>
</div>

<div class="footer">
    NBA Criterion 4 Self-Assessment Report &bull; ${academicYear} &bull; Generated on ${dateStr} &bull; Page auto-numbered by browser
</div>

</body>
</html>`;

    const win = window.open("", "_blank");
    if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => win.print(), 400);
    }
}

// ── Page Component ────────────────────────────────────────────
export default function NBAReportPage() {
    const [academicYear, setAcademicYear] = useState("2024-25");
    const { admin, loading: authLoading } = useAdminAuth();
    const { achievements, loading: dataLoading } = useAllAchievements();

    const categoryStats = useMemo(() => computeCategoryStats(achievements), [achievements]);
    const monthlyStats = useMemo(() => computeMonthlyStats(achievements), [achievements]);
    const departmentStats = useMemo(() => computeDepartmentStats(achievements), [achievements]);
    const topStudents = useMemo(() => computeTopStudents(achievements), [achievements]);

    const totalAchievements = useMemo(() => categoryStats.reduce((s, c) => s + c.count, 0), [categoryStats]);
    const totalApproved = useMemo(() => categoryStats.reduce((s, c) => s + c.approved, 0), [categoryStats]);
    const totalPending = useMemo(() => categoryStats.reduce((s, c) => s + c.pending, 0), [categoryStats]);
    const totalRejected = useMemo(() => categoryStats.reduce((s, c) => s + c.rejected, 0), [categoryStats]);
    const totalPoints = useMemo(() => categoryStats.reduce((s, c) => s + c.points, 0), [categoryStats]);
    const approvalRate = totalAchievements > 0 ? Math.round((totalApproved / totalAchievements) * 100) : 0;
    const uniqueStudents = useMemo(() => new Set(achievements.map((a) => a.studentId)).size, [achievements]);
    const pendingCount = useMemo(() => achievements.filter((a) => a.status === "pending").length, [achievements]);

    const pieData = useMemo(() => categoryStats.map((c) => ({ name: c.category, value: c.count })), [categoryStats]);
    const categoryBarData = useMemo(() => categoryStats.map((c) => ({
        name: c.category.length > 8 ? c.category.slice(0, 8) + "." : c.category,
        Approved: c.approved,
        Pending: c.pending,
        Rejected: c.rejected,
    })), [categoryStats]);
    const areaData = useMemo(() => monthlyStats.map((m) => ({
        name: m.month,
        Total: m.total,
        Approved: m.approved,
        Pending: m.pending,
    })), [monthlyStats]);

    if (authLoading || dataLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20376b]" />
            </div>
        );
    }

    if (!admin) return null;

    return (
        <DashboardLayout user={profileToUser(admin)} role="admin" pendingCount={pendingCount}>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-[#20376b]" />
                        NBA Criterion 4 Report
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Students&apos; Performance and Outcomes &mdash; Self-Assessment Report
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={academicYear} onValueChange={setAcademicYear}>
                        <SelectTrigger className="h-9 w-[140px] text-sm">
                            <SelectValue placeholder="Academic Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024-25">2024-25</SelectItem>
                            <SelectItem value="2023-24">2023-24</SelectItem>
                            <SelectItem value="2022-23">2022-23</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={() => handlePrintReport(academicYear, achievements, categoryStats, departmentStats, monthlyStats, topStudents)}
                        className="bg-[#20376b] hover:bg-[#1a2d54] text-white h-9 text-sm gap-2"
                    >
                        <Printer className="h-4 w-4" />
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Executive Summary */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard title="Unique Students" value={uniqueStudents.toLocaleString()} icon={GraduationCap} color="navy" />
                <StatCard title="Total Achievements" value={totalAchievements} icon={Trophy} color="teal" />
                <StatCard title="Approved" value={totalApproved} icon={CheckCircle} color="emerald" />
                <StatCard title="Approval Rate" value={`${approvalRate}%`} icon={TrendingUp} color="amber" />
            </div>

            {/* Table 4.1: Category-wise Summary */}
            <Card className="border-slate-200 shadow-sm mb-6">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-semibold text-slate-800">
                                Table 4.1: Category-wise Achievement Distribution
                            </CardTitle>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Breakdown of achievements by NBA-defined activity categories
                            </p>
                        </div>
                        <Badge className="bg-[#20376b]/10 text-[#20376b] border-[#20376b]/20 text-[10px]">
                            {academicYear}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Category</th>
                                    <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Total</th>
                                    <th className="text-right py-2.5 px-3 font-semibold text-emerald-700">Approved</th>
                                    <th className="text-right py-2.5 px-3 font-semibold text-amber-700">Pending</th>
                                    <th className="text-right py-2.5 px-3 font-semibold text-red-700">Rejected</th>
                                    <th className="text-right py-2.5 px-3 font-semibold text-[#20376b]">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryStats.map((c) => (
                                    <tr key={c.category} className="border-b border-slate-100 hover:bg-slate-50/50">
                                        <td className="py-2 px-3 font-medium text-slate-800">{c.category}</td>
                                        <td className="py-2 px-3 text-right text-slate-600">{c.count}</td>
                                        <td className="py-2 px-3 text-right text-emerald-600 font-medium">{c.approved}</td>
                                        <td className="py-2 px-3 text-right text-amber-600">{c.pending}</td>
                                        <td className="py-2 px-3 text-right text-red-500">{c.rejected}</td>
                                        <td className="py-2 px-3 text-right font-semibold text-[#20376b]">{c.points.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-slate-100 border-t-2 border-slate-300">
                                    <td className="py-2.5 px-3 font-bold text-slate-900">Total</td>
                                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">{totalAchievements}</td>
                                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">{totalApproved}</td>
                                    <td className="py-2.5 px-3 text-right font-bold text-amber-700">{totalPending}</td>
                                    <td className="py-2.5 px-3 text-right font-bold text-red-700">{totalRejected}</td>
                                    <td className="py-2.5 px-3 text-right font-bold text-[#20376b]">{totalPoints.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Charts: Category Distribution + Status Breakdown */}
            <div className="grid gap-5 lg:grid-cols-3 mb-6">
                <ChartWrapper title="Figure 4.1: Category Distribution" description="Achievement count by category">
                    <CustomPieChart data={pieData} height={240} innerRadius={50} />
                </ChartWrapper>
                <div className="lg:col-span-2">
                    <ChartWrapper title="Figure 4.2: Category-wise Status Breakdown" description="Approved, pending, and rejected per category">
                        <CustomBarChart
                            data={categoryBarData}
                            bars={[
                                { key: "Approved", label: "Approved", color: "#059669" },
                                { key: "Pending", label: "Pending", color: "#d97706" },
                                { key: "Rejected", label: "Rejected", color: "#dc2626" },
                            ]}
                            height={240}
                        />
                    </ChartWrapper>
                </div>
            </div>

            {/* Table 4.2: Department-wise Performance */}
            <Card className="border-slate-200 shadow-sm mb-6">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-800">
                        Table 4.2: Department-wise Performance Summary
                    </CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Achievement statistics across departments with participation rates
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Department</th>
                                    <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Students</th>
                                    <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Total Achievements</th>
                                    <th className="text-right py-2.5 px-3 font-semibold text-emerald-700">Approved</th>
                                    <th className="text-right py-2.5 px-3 font-semibold text-[#20376b]">Total Points</th>
                                    <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Participation Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departmentStats.map((d) => {
                                    const rate = ((d.totalAchievements / d.totalStudents) * 100).toFixed(1);
                                    return (
                                        <tr key={d.department} className="border-b border-slate-100 hover:bg-slate-50/50">
                                            <td className="py-2 px-3 font-medium text-slate-800">{d.department}</td>
                                            <td className="py-2 px-3 text-right text-slate-600">{d.totalStudents}</td>
                                            <td className="py-2 px-3 text-right text-slate-600">{d.totalAchievements}</td>
                                            <td className="py-2 px-3 text-right text-emerald-600 font-medium">{d.approvedAchievements}</td>
                                            <td className="py-2 px-3 text-right font-semibold text-[#20376b]">{d.totalPoints.toLocaleString()}</td>
                                            <td className="py-2 px-3 text-right">
                                                <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[10px]">{rate}%</Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Figure 4.3: Monthly Trend */}
            <div className="mb-6">
                <ChartWrapper title="Figure 4.3: Monthly Achievement Submission Trend" description="Total, approved, and pending submissions across the academic year">
                    <CustomAreaChart
                        data={areaData}
                        areas={[
                            { key: "Total", label: "Total", color: "#20376b" },
                            { key: "Approved", label: "Approved", color: "#10b981" },
                            { key: "Pending", label: "Pending", color: "#f59e0b" },
                        ]}
                        height={260}
                    />
                </ChartWrapper>
            </div>

            {/* Table 4.3: Top Students */}
            <Card className="border-slate-200 shadow-sm mb-6">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-800">
                        Table 4.3: Top Performing Students
                    </CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Students with highest achievement points in the academic year
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-center py-2.5 px-3 font-semibold text-slate-700 w-12">Rank</th>
                                    <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Student Name</th>
                                    <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Department</th>
                                    <th className="text-right py-2.5 px-3 font-semibold text-[#20376b]">Points</th>
                                    <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Achievements</th>
                                    <th className="text-right py-2.5 px-3 font-semibold text-emerald-700">Approved</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topStudents.map((s, i) => (
                                    <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                        <td className="py-2 px-3 text-center">
                                            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-200 text-slate-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-slate-50 text-slate-400"}`}>
                                                {i + 1}
                                            </span>
                                        </td>
                                        <td className="py-2 px-3">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="bg-[#20376b]/10 text-[#20376b] text-[8px] font-semibold">
                                                        {s.name.split(" ").map((n: string) => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-slate-900">{s.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-2 px-3 text-slate-600">{s.department}</td>
                                        <td className="py-2 px-3 text-right font-bold text-[#20376b]">{s.totalPoints}</td>
                                        <td className="py-2 px-3 text-right text-slate-600">{s.totalAchievements}</td>
                                        <td className="py-2 px-3 text-right text-emerald-600 font-medium">{s.approvedCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Separator className="my-6" />

            {/* Annexure 4.1: Detailed Records */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-[#20376b]" />
                                Annexure 4.1: Complete Achievement Records
                            </CardTitle>
                            <p className="text-xs text-slate-500 mt-0.5">
                                All student achievement submissions for the academic year {academicYear}
                            </p>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                            {achievements.length} records
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={recordColumns}
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

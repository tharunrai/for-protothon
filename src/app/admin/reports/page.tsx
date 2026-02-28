"use client";

import { useState } from "react";
import { Download, FileText, Filter, Calendar, RefreshCw } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, StatusBadge, CategoryBadge, Column } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { currentAdmin, achievements } from "@/lib/dummy-data";
import { Achievement, AchievementCategory, AchievementStatus } from "@/types";
import { cn } from "@/lib/utils";

const categories: (AchievementCategory | "All")[] = [
    "All", "Academic", "Research", "Sports", "Cultural", "Co-Curricular", "Professional",
];

const departments = ["All", "Computer Science & Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"];

const statuses: (AchievementStatus | "All")[] = ["All", "approved", "pending", "rejected"];

const achievementColumns: Column<Achievement>[] = [
    { key: "studentName", label: "Student", sortable: true },
    {
        key: "title", label: "Achievement", render: (_, row) => (
            <span className="text-xs text-slate-700 max-w-[180px] block truncate">{row.title}</span>
        )
    },
    { key: "category", label: "Category", render: (val) => <CategoryBadge category={String(val)} /> },
    {
        key: "department", label: "Department", render: (val) => (
            <span className="text-xs text-slate-500">{String(val).split(" ")[0]}</span>
        )
    },
    { key: "date", label: "Date", sortable: true },
    {
        key: "points", label: "Points", sortable: true, render: (val) => (
            <span className="text-xs font-semibold text-[#20376b]">{String(val)} pts</span>
        )
    },
    { key: "status", label: "Status", render: (_, row) => <StatusBadge status={row.status} /> },
];

export default function ReportsPage() {
    const [dept, setDept] = useState("All");
    const [category, setCategory] = useState<AchievementCategory | "All">("All");
    const [status, setStatus] = useState<AchievementStatus | "All">("All");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);

    const filtered = achievements.filter((a) => {
        const matchDept = dept === "All" || a.department === dept;
        const matchCat = category === "All" || a.category === category;
        const matchStatus = status === "All" || a.status === status;
        const matchFrom = !fromDate || a.date >= fromDate;
        const matchTo = !toDate || a.date <= toDate;
        return matchDept && matchCat && matchStatus && matchFrom && matchTo;
    });

    const handleGenerate = async () => {
        setGenerating(true);
        await new Promise((r) => setTimeout(r, 1500));
        setGenerating(false);
        setGenerated(true);
    };

    const handleReset = () => {
        setDept("All");
        setCategory("All");
        setStatus("All");
        setFromDate("");
        setToDate("");
        setGenerated(false);
    };

    const handleExportCSV = () => {
        const headers = ["Student", "Title", "Category", "Department", "Date", "Points", "Status"];
        const rows = filtered.map((a) => [
            `"${a.studentName}"`,
            `"${a.title}"`,
            `"${a.category}"`,
            `"${a.department}"`,
            `"${a.date}"`,
            a.points,
            `"${a.status}"`,
        ]);
        const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nba-report-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportPDF = () => {
        const rows = filtered
            .map((a) => `<tr><td>${a.studentName}</td><td>${a.title}</td><td>${a.category}</td><td>${a.department}</td><td>${a.date}</td><td>${a.points} pts</td><td>${a.status}</td></tr>`)
            .join("");
        const html = `<!DOCTYPE html><html><head><title>NBA Report</title>
<style>body{font-family:sans-serif;padding:24px}h2{margin-bottom:8px}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #ccc;padding:6px 10px;text-align:left}th{background:#f1f5f9}tr:nth-child(even){background:#f8fafc}</style>
</head><body><h2>NBA Criterion 4 – Achievement Report</h2>
<p style="font-size:12px;color:#64748b">Generated: ${new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})} · ${filtered.length} records</p>
<table><thead><tr><th>Student</th><th>Title</th><th>Category</th><th>Department</th><th>Date</th><th>Points</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
        const win = window.open("", "_blank");
        if (win) { win.document.write(html); win.document.close(); win.print(); }
    };

    return (
        <DashboardLayout user={currentAdmin} role="admin">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Reports</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    Filter and generate achievement reports for NBA Criterion 4 documentation.
                </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
                {/* Filters Panel */}
                <Card className="border-slate-200 shadow-sm h-fit">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-slate-500" />
                            <CardTitle className="text-sm font-semibold text-slate-800">Report Filters</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Department */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-slate-700">Department</Label>
                            <Select value={dept} onValueChange={setDept}>
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((d) => (
                                        <SelectItem key={d} value={d} className="text-sm">{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-slate-700">Category</Label>
                            <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c} value={c} className="text-sm">{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-slate-700">Status</Label>
                            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((s) => (
                                        <SelectItem key={s} value={s} className="text-sm capitalize">{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator className="my-1" />

                        {/* Date Range */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Date Range
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-[10px] text-slate-400">From</Label>
                                    <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-8 text-xs mt-0.5" />
                                </div>
                                <div>
                                    <Label className="text-[10px] text-slate-400">To</Label>
                                    <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-8 text-xs mt-0.5" />
                                </div>
                            </div>
                        </div>

                        <Separator className="my-1" />

                        {/* Actions */}
                        <Button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="w-full bg-[#20376b] hover:bg-[#1a2d54] text-white h-9 text-sm"
                        >
                            {generating ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    Generating...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Generate Report
                                </span>
                            )}
                        </Button>

                        <Button onClick={handleReset} variant="outline" className="w-full h-8 text-xs gap-1.5">
                            <RefreshCw className="h-3.5 w-3.5" /> Reset Filters
                        </Button>
                    </CardContent>
                </Card>

                {/* Report Results */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Summary card if generated */}
                    {generated && (
                        <Card className="border-emerald-200 bg-emerald-50/50">
                            <CardContent className="py-4 px-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-emerald-800">Report Ready</p>
                                        <p className="text-xs text-emerald-600 mt-0.5">
                                            {filtered.length} records · Generated on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={handleExportCSV} size="sm" variant="outline" className="h-8 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-100 gap-1.5">
                                            <Download className="h-3.5 w-3.5" /> Export CSV
                                        </Button>
                                        <Button onClick={handleExportPDF} size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                                            <Download className="h-3.5 w-3.5" /> Export PDF
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Active filters summary */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs text-slate-500">Active filters:</span>
                        {dept !== "All" && <Badge variant="outline" className="text-[10px]">{dept.split(" ")[0]}</Badge>}
                        {category !== "All" && <Badge variant="outline" className="text-[10px]">{category}</Badge>}
                        {status !== "All" && <Badge variant="outline" className="text-[10px] capitalize">{status}</Badge>}
                        {fromDate && <Badge variant="outline" className="text-[10px]">From: {fromDate}</Badge>}
                        {toDate && <Badge variant="outline" className="text-[10px]">To: {toDate}</Badge>}
                        {dept === "All" && category === "All" && status === "All" && !fromDate && !toDate && (
                            <span className="text-xs text-slate-400 italic">None (showing all)</span>
                        )}
                    </div>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-semibold text-slate-800">Filtered Results</CardTitle>
                                <p className="text-xs text-slate-500 mt-0.5">{filtered.length} achievements match the selected filters</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={achievementColumns}
                                data={filtered}
                                searchable
                                searchKey="studentName"
                                searchPlaceholder="Search by student..."
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}

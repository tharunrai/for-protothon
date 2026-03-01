"use client";
export const dynamic = "force-dynamic";

import { useMemo } from "react";
import {
    useStudentAuth,
    useStudentAchievements,
    computeCategoryStats,
    profileToUser,
} from "@/lib/hooks";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, Column } from "@/components/shared/DataTable";
import { CustomPieChart } from "@/components/shared/ChartComponents";
import { Badge } from "@/components/ui/badge";
import { Trophy, CheckCircle, Clock, XCircle } from "lucide-react";
import { Achievement, AchievementStatus } from "@/types";

const statusColors: Record<AchievementStatus, string> = {
    approved: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    rejected: "bg-red-100 text-red-700",
};

const categoryColors: Record<string, string> = {
    Academic: "#3b82f6",
    Research: "#8b5cf6",
    Sports: "#10b981",
    Cultural: "#f59e0b",
    "Co-Curricular": "#ef4444",
    Professional: "#6366f1",
};

const achievementColumns: Column<Achievement>[] = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "date", label: "Date" },
    {
        key: "status",
        label: "Status",
        render: (val) => (
            <Badge className={`${statusColors[val as AchievementStatus]} capitalize text-[10px]`}>
                {String(val)}
            </Badge>
        ),
    },
    {
        key: "points",
        label: "Points",
        render: (val, row) =>
            row.status === "approved" ? String(val) : "—",
    },
];

export default function StudentDashboardPage() {
    const { student, loading: authLoading } = useStudentAuth();
    const { achievements, loading: dataLoading } = useStudentAchievements(student?.uid);

    const loading = authLoading || dataLoading;

    const stats = useMemo(() => {
        const approved = achievements.filter((a) => a.status === "approved");
        const pending = achievements.filter((a) => a.status === "pending");
        const rejected = achievements.filter((a) => a.status === "rejected");
        const totalPoints = approved.reduce((s, a) => s + a.points, 0);
        return { totalPoints, approved: approved.length, pending: pending.length, rejected: rejected.length };
    }, [achievements]);

    const catStats = useMemo(() => computeCategoryStats(achievements), [achievements]);

    const pieData = useMemo(
        () =>
            catStats
                .filter((c) => c.count > 0)
                .map((c) => ({
                    name: c.category,
                    value: c.count,
                    color: categoryColors[c.category] || "#94a3b8",
                })),
        [catStats]
    );

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
                    <h1 className="text-2xl font-bold text-slate-900">
                        Welcome back, {student.name.split(" ")[0]}!
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Here&apos;s a summary of your achievements and progress.
                    </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Points"
                        value={stats.totalPoints}
                        icon={Trophy}
                        description="Approved achievement points"
                    />
                    <StatCard
                        title="Approved"
                        value={stats.approved}
                        icon={CheckCircle}
                        trend={achievements.length > 0 ? Math.round((stats.approved / achievements.length) * 100) : 0}
                        description="of total submissions"
                    />
                    <StatCard
                        title="Pending"
                        value={stats.pending}
                        icon={Clock}
                        description="Awaiting review"
                    />
                    <StatCard
                        title="Rejected"
                        value={stats.rejected}
                        icon={XCircle}
                        description="Needs revision"
                    />
                </div>

                {/* Pie + Recent table */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">By Category</h3>
                        {pieData.length > 0 ? (
                            <CustomPieChart data={pieData} height={260} />
                        ) : (
                            <p className="text-sm text-slate-400 text-center py-10">No achievements yet.</p>
                        )}
                    </div>
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Achievements</h3>
                        <DataTable columns={achievementColumns} data={achievements.slice(0, 10)} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

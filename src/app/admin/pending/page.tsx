"use client";
export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
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
import { CategoryBadge, StatusBadge } from "@/components/shared/DataTable";
import { ChartWrapper, CustomBarChart } from "@/components/shared/ChartComponents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Achievement } from "@/types";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
    useAdminAuth,
    useAllAchievements,
    useAllUsers,
    computeMonthlyStats,
    computeTopStudents,
    profileToUser,
} from "@/lib/hooks";

export default function PendingApprovalsPage() {
    const { admin, loading: loadingAuth } = useAdminAuth();
    const { achievements, loading: loadingAch } = useAllAchievements();
    const { users } = useAllUsers();

    const [selected, setSelected] = useState<(Achievement & { adminRemark: string }) | null>(null);
    const [pointsInput, setPointsInput] = useState("");
    const [remarkInput, setRemarkInput] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const pending = achievements.filter((a) => a.status === "pending");
    const reviewed = achievements.filter((a) => a.status !== "pending");
    const approvalRate = achievements.length > 0
        ? Math.round((achievements.filter((a) => a.status === "approved").length / achievements.length) * 100)
        : 0;

    const monthlyStats = useMemo(() => computeMonthlyStats(achievements), [achievements]);
    const topStudents = useMemo(() => computeTopStudents(achievements), [achievements]);

    const barDataReview = monthlyStats.slice(-6).map((m) => ({
        name: m.month,
        Approved: m.approved,
        Pending: m.pending,
        Rejected: m.rejected,
    }));

    const studentProgress = topStudents.slice(0, 4).map((s) => ({
        ...s,
        rate: s.totalAchievements > 0 ? Math.round((s.approvedCount / s.totalAchievements) * 100) : 0,
    }));

    const approve = async (id: string, points: number) => {
        setActionLoading(true);
        try {
            await updateDoc(doc(db, "achievements", id), {
                status: "approved",
                points,
                reviewed_by: admin?.name || "Admin",
                reviewed_at: new Date().toISOString().slice(0, 10),
                admin_remark: "",
            });
        } catch (e) { console.error(e); }
        setActionLoading(false);
        setSelected(null);
        setPointsInput("");
    };

    const reject = async (id: string, remark: string) => {
        setActionLoading(true);
        try {
            await updateDoc(doc(db, "achievements", id), {
                status: "rejected",
                reviewed_by: admin?.name || "Admin",
                reviewed_at: new Date().toISOString().slice(0, 10),
                admin_remark: remark,
            });
        } catch (e) { console.error(e); }
        setActionLoading(false);
        setSelected(null);
        setRemarkInput("");
    };

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
                <h1 className="text-xl font-bold text-slate-900">Pending Approvals</h1>
                <p className="text-sm text-slate-500 mt-0.5">Review and act on student achievement submissions.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard title="Awaiting Review" value={pending.length} icon={Clock} color="amber" />
                <StatCard title="Reviewed Total" value={reviewed.length} icon={CheckCircle} color="emerald" />
                <StatCard title="Students" value={users.length} icon={Users} color="navy" />
                <StatCard title="Approval Rate" value={`${approvalRate}%`} icon={TrendingUp} color="teal" />
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
                        {studentProgress.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-4">No data yet.</p>
                        ) : studentProgress.map((s) => (
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
                                    <span className="text-[10px] text-slate-500">{s.rate}%</span>
                                </div>
                                <Progress value={s.rate} className="h-1.5" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-slate-800">
                        Pending Submissions ({pending.length})
                    </CardTitle>
                    <p className="text-xs text-slate-500">Click the approve or reject buttons to take action</p>
                </CardHeader>
                <CardContent className="px-2">
                    {loadingAch ? (
                        <div className="space-y-3 px-2">
                            {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}
                        </div>
                    ) : pending.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-3xl mb-3">✅</div>
                            <p className="text-sm font-medium text-slate-700">All caught up!</p>
                            <p className="text-xs text-slate-400 mt-1">No pending submissions right now.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {pending.map((a) => (
                                <div key={a.id} className="flex items-center gap-3 py-3 px-4 hover:bg-slate-50 rounded-lg transition-colors">
                                    <Avatar className="h-8 w-8 shrink-0">
                                        <AvatarFallback className="bg-emerald-50 text-emerald-700 text-[9px] font-semibold">
                                            {a.studentName.split(" ").map((n) => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-slate-900 truncate">{a.title}</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            {a.studentName} · {a.department.split(" ")[0]} · {a.date}
                                        </p>
                                    </div>
                                    <CategoryBadge category={a.category} />
                                    <StatusBadge status={a.status} />
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-slate-400 hover:text-slate-700"
                                            onClick={() => { setSelected(a as any); setPointsInput(""); setRemarkInput(""); }}
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            className="h-7 w-7 bg-emerald-500 hover:bg-emerald-600 text-white"
                                            onClick={() => { setSelected(a as any); setPointsInput(""); setRemarkInput(""); }}
                                        >
                                            <Check className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-7 w-7 border-red-200 text-red-500 hover:bg-red-50"
                                            onClick={() => { setSelected(a as any); setPointsInput(""); setRemarkInput(""); }}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {selected && (
                <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-base leading-snug">{selected.title}</DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                {selected.studentName} · {selected.department.split(" ")[0]} · {selected.date}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 text-sm mt-1">
                            <div className="bg-slate-50 rounded-md p-3 text-xs">
                                <p className="text-slate-400 mb-1">Description</p>
                                <p className="text-slate-700 leading-relaxed">{selected.description}</p>
                            </div>
                            {selected.proof && (
                                <div className="bg-slate-50 rounded-md p-3 text-xs">
                                    <p className="text-slate-400 mb-1">Proof</p>
                                    <p className="text-[#20376b] font-medium">{selected.proof}</p>
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-slate-700">Assign Points (to approve)</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={200}
                                    placeholder="e.g. 80"
                                    value={pointsInput}
                                    onChange={(e) => setPointsInput(e.target.value)}
                                    className="h-9 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-slate-700">Rejection Remark (to reject)</Label>
                                <Input
                                    placeholder="e.g. Insufficient proof provided."
                                    value={remarkInput}
                                    onChange={(e) => setRemarkInput(e.target.value)}
                                    className="h-9 text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Button
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white gap-1.5"
                                disabled={actionLoading || !pointsInput || isNaN(Number(pointsInput))}
                                onClick={() => approve(selected.id, Number(pointsInput))}
                            >
                                {actionLoading ? <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Check className="h-4 w-4" />}
                                Approve
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
                                disabled={actionLoading || !remarkInput.trim()}
                                onClick={() => reject(selected.id, remarkInput.trim())}
                            >
                                {actionLoading ? <span className="h-3.5 w-3.5 rounded-full border-2 border-red-400 border-t-transparent animate-spin" /> : <X className="h-4 w-4" />}
                                Reject
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </DashboardLayout>
    );
}

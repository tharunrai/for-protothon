"use client";

import { useState } from "react";
import { Check, X, Eye, Filter } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CategoryBadge, Column } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { currentAdmin, achievements as initialAchievements } from "@/lib/dummy-data";
import { Achievement, AchievementStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusColors: Record<AchievementStatus, string> = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function AdminAchievementsPage() {
    const [items, setItems] = useState<Achievement[]>(initialAchievements);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [selected, setSelected] = useState<Achievement | null>(null);

    const approve = (id: string) =>
        setItems((prev) =>
            prev.map((a) =>
                a.id === id
                    ? { ...a, status: "approved", reviewedBy: currentAdmin.name, reviewedAt: new Date().toISOString().slice(0, 10) }
                    : a
            )
        );

    const reject = (id: string) =>
        setItems((prev) =>
            prev.map((a) =>
                a.id === id
                    ? { ...a, status: "rejected", reviewedBy: currentAdmin.name, reviewedAt: new Date().toISOString().slice(0, 10) }
                    : a
            )
        );

    const filtered = items.filter((a) => {
        const matchSearch = a.studentName.toLowerCase().includes(search.toLowerCase()) ||
            a.title.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCategory === "All" || a.category === filterCategory;
        return matchSearch && matchCat;
    });

    const pending = filtered.filter((a) => a.status === "pending");
    const approved = filtered.filter((a) => a.status === "approved");
    const rejected = filtered.filter((a) => a.status === "rejected");

    const AchievementRow = ({ a }: { a: Achievement }) => (
        <div className="flex items-center gap-3 py-3 px-4 hover:bg-slate-50 rounded-lg transition-colors">
            <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-[#20376b]/10 text-[#20376b] text-[10px] font-semibold">
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
            <span className="text-xs font-semibold text-[#20376b] shrink-0">{a.points} pts</span>
            <Badge variant="outline" className={cn("text-[10px] capitalize shrink-0", statusColors[a.status])}>
                {a.status}
            </Badge>
            <div className="flex items-center gap-1 shrink-0">
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-slate-400 hover:text-slate-700"
                    onClick={() => setSelected(a)}
                >
                    <Eye className="h-3.5 w-3.5" />
                </Button>
                {a.status !== "approved" && (
                    <Button
                        size="icon"
                        className="h-7 w-7 bg-emerald-500 hover:bg-emerald-600 text-white"
                        onClick={() => approve(a.id)}
                    >
                        <Check className="h-3.5 w-3.5" />
                    </Button>
                )}
                {a.status !== "rejected" && (
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7 border-red-200 text-red-500 hover:bg-red-50"
                        onClick={() => reject(a.id)}
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <DashboardLayout user={currentAdmin} role="admin" pendingCount={items.filter((a) => a.status === "pending").length}>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Achievements</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    Review, approve, or reject student achievement submissions.
                </p>
            </div>

            {/* Summary badges */}
            <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
                    <span className="text-xs font-medium text-amber-700">Pending</span>
                    <span className="text-sm font-bold text-amber-700">{items.filter((a) => a.status === "pending").length}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2">
                    <span className="text-xs font-medium text-emerald-700">Approved</span>
                    <span className="text-sm font-bold text-emerald-700">{items.filter((a) => a.status === "approved").length}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2">
                    <span className="text-xs font-medium text-rose-700">Rejected</span>
                    <span className="text-sm font-bold text-rose-700">{items.filter((a) => a.status === "rejected").length}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <Input
                    placeholder="Search by student or achievement title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-9 text-sm max-w-sm"
                />
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="h-9 text-sm w-48">
                        <Filter className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        {["All", "Academic", "Research", "Sports", "Cultural", "Co-Curricular", "Professional"].map((c) => (
                            <SelectItem key={c} value={c} className="text-sm">{c}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="pending">
                <TabsList className="mb-4">
                    <TabsTrigger value="pending">
                        Pending
                        {pending.length > 0 && (
                            <span className="ml-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-[9px] font-bold">
                                {pending.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
                    <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
                </TabsList>

                {[
                    { value: "pending", data: pending, emptyMsg: "No pending submissions." },
                    { value: "all", data: filtered, emptyMsg: "No achievements found." },
                    { value: "approved", data: approved, emptyMsg: "No approved achievements." },
                    { value: "rejected", data: rejected, emptyMsg: "No rejected achievements." },
                ].map(({ value, data, emptyMsg }) => (
                    <TabsContent key={value} value={value}>
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-slate-800 capitalize">{value === "all" ? "All Submissions" : value}</CardTitle>
                            </CardHeader>
                            <CardContent className="px-2">
                                {data.length === 0 ? (
                                    <p className="text-xs text-slate-400 text-center py-8">{emptyMsg}</p>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {data.map((a) => <AchievementRow key={a.id} a={a} />)}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Detail Dialog */}
            {selected && (
                <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-base leading-snug">{selected.title}</DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Submitted by {selected.studentName} · {selected.date}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 text-sm mt-1">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-slate-50 rounded-md p-3">
                                    <p className="text-slate-400 mb-0.5">Category</p>
                                    <p className="font-medium text-slate-800">{selected.category}</p>
                                </div>
                                <div className="bg-slate-50 rounded-md p-3">
                                    <p className="text-slate-400 mb-0.5">Points</p>
                                    <p className="font-semibold text-[#20376b]">{selected.points} pts</p>
                                </div>
                                <div className="bg-slate-50 rounded-md p-3">
                                    <p className="text-slate-400 mb-0.5">Department</p>
                                    <p className="font-medium text-slate-800">{selected.department.split(" ")[0]}</p>
                                </div>
                                <div className="bg-slate-50 rounded-md p-3">
                                    <p className="text-slate-400 mb-0.5">Status</p>
                                    <Badge variant="outline" className={cn("text-[10px] capitalize", statusColors[selected.status])}>
                                        {selected.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-md p-3 text-xs">
                                <p className="text-slate-400 mb-1">Description</p>
                                <p className="text-slate-700 leading-relaxed">{selected.description}</p>
                            </div>
                            {selected.proof && (
                                <div className="bg-slate-50 rounded-md p-3 text-xs">
                                    <p className="text-slate-400 mb-1">Proof Document</p>
                                    <p className="text-[#20376b] font-medium">{selected.proof}</p>
                                </div>
                            )}
                            {selected.reviewedBy && (
                                <div className="bg-slate-50 rounded-md p-3 text-xs">
                                    <p className="text-slate-400 mb-1">Reviewed By</p>
                                    <p className="text-slate-700">{selected.reviewedBy} · {selected.reviewedAt}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 mt-2">
                            {selected.status !== "approved" && (
                                <Button
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white gap-1.5"
                                    onClick={() => { approve(selected.id); setSelected(null); }}
                                >
                                    <Check className="h-4 w-4" /> Approve
                                </Button>
                            )}
                            {selected.status !== "rejected" && (
                                <Button
                                    variant="outline"
                                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
                                    onClick={() => { reject(selected.id); setSelected(null); }}
                                >
                                    <X className="h-4 w-4" /> Reject
                                </Button>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </DashboardLayout>
    );
}

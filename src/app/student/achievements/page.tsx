"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AchievementForm } from "@/components/shared/AchievementForm";
import { DataTable, StatusBadge, CategoryBadge, Column } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentStudent, myAchievements } from "@/lib/dummy-data";
import { Achievement } from "@/types";

const columns: Column<Achievement>[] = [
    {
        key: "title", label: "Achievement", render: (_, row) => (
            <div className="max-w-xs">
                <p className="text-xs font-medium text-slate-900">{row.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{row.date}</p>
            </div>
        )
    },
    { key: "category", label: "Category", render: (val) => <CategoryBadge category={String(val)} /> },
    {
        key: "points", label: "Points", render: (val) => (
            <span className="text-xs font-semibold text-[#20376b]">{String(val)} pts</span>
        )
    },
    { key: "status", label: "Status", render: (_, row) => <StatusBadge status={row.status} /> },
    {
        key: "reviewedBy", label: "Reviewed By", render: (val) => (
            <span className="text-xs text-slate-500">{val ? String(val) : "—"}</span>
        )
    },
];

export default function AchievementsPage() {
    const approved = myAchievements.filter((a) => a.status === "approved");
    const pending = myAchievements.filter((a) => a.status === "pending");
    const rejected = myAchievements.filter((a) => a.status === "rejected");

    return (
        <DashboardLayout user={currentStudent} role="student" pendingCount={pending.length}>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Achievements</h1>
                <p className="text-sm text-slate-500 mt-0.5">Submit new achievements and track existing ones.</p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="submit">
                <TabsList className="mb-6 bg-slate-100">
                    <TabsTrigger value="submit" className="text-xs">Submit New</TabsTrigger>
                    <TabsTrigger value="all" className="text-xs">
                        All{" "}
                        <Badge className="ml-1.5 h-4 px-1 text-[9px] bg-slate-200 text-slate-700 hover:bg-slate-200">
                            {myAchievements.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="text-xs">
                        Pending{" "}
                        <Badge className="ml-1.5 h-4 px-1 text-[9px] bg-amber-100 text-amber-700 hover:bg-amber-100">
                            {pending.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="approved" className="text-xs">Approved</TabsTrigger>
                </TabsList>

                <TabsContent value="submit">
                    <AchievementForm />
                </TabsContent>

                <TabsContent value="all">
                    <Card className="border-slate-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-slate-800">All Achievements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={columns} data={myAchievements} searchable searchKey="title" searchPlaceholder="Search..." />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pending">
                    <Card className="border-slate-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-slate-800">Pending Review</CardTitle>
                            <p className="text-xs text-slate-500">These achievements are awaiting faculty review.</p>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={columns} data={pending} pagination={false} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="approved">
                    <Card className="border-slate-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-slate-800">Approved Achievements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={columns} data={approved} pagination={false} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
}

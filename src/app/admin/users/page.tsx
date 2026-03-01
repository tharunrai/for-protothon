"use client";
export const dynamic = "force-dynamic";

import { Users, UserCheck, Clock, Shield } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    useAdminAuth,
    useAllUsers,
    useAllAchievements,
    profileToUser,
    UserProfile,
} from "@/lib/hooks";

const userColumns: Column<UserProfile>[] = [
    {
        key: "name", label: "Student", sortable: true, render: (_, row) => (
            <div className="flex items-center gap-2.5">
                <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-[#20376b]/10 text-[#20376b] text-[9px] font-semibold">
                        {row.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-xs font-medium text-slate-900">{row.name}</p>
                    <p className="text-[10px] text-slate-400">{row.email}</p>
                </div>
            </div>
        )
    },
    { key: "rollNumber", label: "Roll No.", render: (val) => <span className="text-xs text-slate-600 font-mono">{val ? String(val) : "—"}</span> },
    { key: "department", label: "Department", sortable: true, render: (val) => <span className="text-xs text-slate-600">{String(val || "—").split(" ")[0]}</span> },
    { key: "joinedAt", label: "Joined", sortable: true, render: (val) => <span className="text-xs text-slate-500">{String(val || "—")}</span> },
    {
        key: "role", label: "Status", render: () => (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Active</Badge>
        )
    },
];

export default function UsersPage() {
    const { admin, loading: loadingAuth } = useAdminAuth();
    const { users, loading: loadingUsers } = useAllUsers();
    const { achievements } = useAllAchievements();

    const pendingCount = achievements.filter((a) => a.status === "pending").length;

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
        <DashboardLayout user={profileToUser(admin)} role="admin" pendingCount={pendingCount}>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Users</h1>
                <p className="text-sm text-slate-500 mt-0.5">Manage registered students and their account status.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard title="Total Students" value={users.length} icon={Users} color="navy" />
                <StatCard title="Active Users" value={users.length} icon={UserCheck} color="emerald" />
                <StatCard title="Pending Approval" value={pendingCount} icon={Clock} color="amber" />
                <StatCard title="Submissions" value={achievements.length} icon={Shield} color="teal" />
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-800">Registered Students</CardTitle>
                    <p className="text-xs text-slate-500">All students enrolled in the achievement tracking system</p>
                </CardHeader>
                <CardContent>
                    {loadingUsers ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />)}
                        </div>
                    ) : (
                        <DataTable
                            columns={userColumns}
                            data={users}
                            searchable
                            searchKey="name"
                            searchPlaceholder="Search by name..."
                        />
                    )}
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}

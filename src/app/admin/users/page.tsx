"use client";

import { Users, UserCheck, Clock, Shield } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { currentAdmin, students, pendingAchievements, achievements } from "@/lib/dummy-data";
import { User } from "@/types";

const userColumns: Column<User>[] = [
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
    { key: "department", label: "Department", sortable: true, render: (val) => <span className="text-xs text-slate-600">{String(val).split(" ")[0]}</span> },
    { key: "joinedAt", label: "Joined", sortable: true, render: (val) => <span className="text-xs text-slate-500">{String(val)}</span> },
    {
        key: "role", label: "Status", render: () => (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Active</Badge>
        )
    },
];

export default function UsersPage() {
    const totalAchievements = achievements.length;
    const activeStudents = students.length;

    return (
        <DashboardLayout user={currentAdmin} role="admin" pendingCount={pendingAchievements.length}>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Users</h1>
                <p className="text-sm text-slate-500 mt-0.5">Manage registered students and their account status.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard title="Total Students" value="1,200" icon={Users} color="navy" trend={5} trendLabel="vs last year" />
                <StatCard title="Active Users" value={activeStudents} icon={UserCheck} color="emerald" />
                <StatCard title="Pending Approval" value={pendingAchievements.length} icon={Clock} color="amber" />
                <StatCard title="Submissions" value={totalAchievements} icon={Shield} color="teal" />
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-800">Registered Students</CardTitle>
                    <p className="text-xs text-slate-500">All students enrolled in the achievement tracking system</p>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={userColumns}
                        data={students}
                        searchable
                        searchKey="name"
                        searchPlaceholder="Search by name..."
                    />
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AchievementForm } from "@/components/shared/AchievementForm";
import { DataTable, StatusBadge, CategoryBadge, Column } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Achievement, UserRole } from "@/types";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, getDoc, orderBy } from "firebase/firestore";

// ── Types ─────────────────────────────────────────────────────────────────────
type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  year?: number;
};

// ── Table Columns ─────────────────────────────────────────────────────────────
const columns: Column<Achievement>[] = [
  {
    key: "title", label: "Achievement", render: (_, row) => (
      <div className="max-w-xs">
        <p className="text-xs font-medium text-slate-900">{row.title}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{row.date}</p>
      </div>
    )
  },
  {
    key: "category", label: "Category",
    render: (val) => <CategoryBadge category={String(val)} />
  },
  {
    key: "points", label: "Points",
    render: (val) => (
      <span className="text-xs font-semibold text-[#20376b]">{val ? `${val} pts` : "—"}</span>
    )
  },
  {
    key: "status", label: "Status",
    render: (_, row) => <StatusBadge status={row.status} />
  },
  {
    // Admin remark — shows why something was rejected
    key: "reviewedBy", label: "Admin Remark",
    render: (_, row: any) => (
      <span className="text-xs text-slate-500">{row.adminRemark || "—"}</span>
    )
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AchievementsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  // ── Step 1: Get logged in user ─────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (userDoc.exists()) {
        const data = userDoc.data();
        setCurrentUser({
          uid: firebaseUser.uid,
          name: data.full_name || firebaseUser.displayName || "Student",
          email: firebaseUser.email || "",
          role: data.role || "student",
          department: data.department || undefined,
          year: data.year ?? undefined,
        });
      }

      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  // ── Step 2: Real-time achievements listener ────────────────────────────────
  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(db, "achievements"),
      where("student_id", "==", currentUser.uid),
      orderBy("created_at", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          // ✅ These match exactly what AchievementForm saves to Firestore
          title: d.title || "",
          category: d.category || "",
          date: d.date || "",
          description: d.description || "",
          proof: d.proof_name || "",
          // Status & review
          status: d.status || "pending",
          points: d.points || 0,
          adminRemark: d.admin_remark || "",
          reviewedBy: d.reviewed_by || null,
          reviewedAt: d.reviewed_at || null,
          // Student info
          studentId: d.student_id || "",
          studentName: d.student_name || "",
          department: d.department || "",
          submittedAt: d.submitted_at || "",
        } as Achievement & { adminRemark: string };
      });

      setAchievements(data as any);
      setLoadingData(false);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // ── Filtered lists ─────────────────────────────────────────────────────────
  const approved = achievements.filter((a) => a.status === "approved");
  const pending  = achievements.filter((a) => a.status === "pending");
  const rejected = achievements.filter((a) => a.status === "rejected");

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#20376b] border-t-transparent animate-spin" />
          <p className="text-sm text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  const userForLayout = {
    id: currentUser.uid,
    name: currentUser.name,
    email: currentUser.email,
    department: currentUser.department ?? "",
    role: currentUser.role as UserRole,
    joinedAt: "",
  };

  return (
    <DashboardLayout user={userForLayout} role={userForLayout.role} pendingCount={pending.length}>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Achievements</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Submit new achievements and track existing ones.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="submit">
        <TabsList className="mb-6 bg-slate-100">
          <TabsTrigger value="submit" className="text-xs">Submit New</TabsTrigger>
          <TabsTrigger value="all" className="text-xs">
            All{" "}
            <Badge className="ml-1.5 h-4 px-1 text-[9px] bg-slate-200 text-slate-700 hover:bg-slate-200">
              {achievements.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs">
            Pending{" "}
            <Badge className="ml-1.5 h-4 px-1 text-[9px] bg-amber-100 text-amber-700 hover:bg-amber-100">
              {pending.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-xs">
            Approved{" "}
            <Badge className="ml-1.5 h-4 px-1 text-[9px] bg-green-100 text-green-700 hover:bg-green-100">
              {approved.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs">
            Rejected{" "}
            <Badge className="ml-1.5 h-4 px-1 text-[9px] bg-red-100 text-red-700 hover:bg-red-100">
              {rejected.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Submit Tab */}
        <TabsContent value="submit">
          <AchievementForm
            studentId={currentUser.uid}
            studentName={currentUser.name}
            department={currentUser.department || ""}
          />
        </TabsContent>

        {/* All Tab */}
        <TabsContent value="all">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-800">All Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingData ? <LoadingSkeleton /> : (
                <DataTable
                  columns={columns}
                  data={achievements}
                  searchable
                  searchKey="title"
                  searchPlaceholder="Search achievements..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Tab */}
        <TabsContent value="pending">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-800">Pending Review</CardTitle>
              <p className="text-xs text-slate-500">Awaiting admin review.</p>
            </CardHeader>
            <CardContent>
              {loadingData ? <LoadingSkeleton /> : pending.length === 0
                ? <EmptyState message="No pending achievements." />
                : <DataTable columns={columns} data={pending} pagination={false} />}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approved Tab */}
        <TabsContent value="approved">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-800">Approved Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingData ? <LoadingSkeleton /> : approved.length === 0
                ? <EmptyState message="No approved achievements yet." />
                : <DataTable columns={columns} data={approved} pagination={false} />}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rejected Tab */}
        <TabsContent value="rejected">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-800">Rejected Achievements</CardTitle>
              <p className="text-xs text-slate-500">Check admin remarks and resubmit if needed.</p>
            </CardHeader>
            <CardContent>
              {loadingData ? <LoadingSkeleton /> : rejected.length === 0
                ? <EmptyState message="No rejected achievements." />
                : <DataTable columns={columns} data={rejected} pagination={false} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-3xl mb-3">🏅</div>
      <p className="text-sm font-medium text-slate-700">{message}</p>
      <p className="text-xs text-slate-400 mt-1">Achievements you submit will appear here.</p>
    </div>
  );
}
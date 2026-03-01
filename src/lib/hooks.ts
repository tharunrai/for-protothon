"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    doc,
    getDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
    Achievement,
    AchievementCategory,
    CategoryStats,
    MonthlyStats,
    DepartmentStats,
    TopStudent,
    User,
} from "@/types";

// ── User Profile type (Firestore doc shape) ──────────────────────────────────
export type UserProfile = {
    uid: string;
    name: string;
    email: string;
    role: string;
    department: string;
    rollNumber?: string;
    employeeId?: string;
    joinedAt: string;
};

// ── Convert UserProfile → User (for DashboardLayout) ─────────────────────────
export function profileToUser(profile: UserProfile): User {
    return {
        id: profile.uid,
        name: profile.name,
        email: profile.email,
        role: profile.role as "student" | "admin",
        department: profile.department,
        rollNumber: profile.rollNumber,
        employeeId: profile.employeeId,
        joinedAt: profile.joinedAt,
    };
}

// ── useAdminAuth: verifies the current user is an admin ──────────────────────
export function useAdminAuth() {
    const router = useRouter();
    const [admin, setAdmin] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                router.push("/login");
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    const role = data.role || "student";

                    if (role !== "admin") {
                        router.push("/student/dashboard");
                        return;
                    }

                    setAdmin({
                        uid: firebaseUser.uid,
                        name: data.full_name || firebaseUser.displayName || "Admin",
                        email: firebaseUser.email || "",
                        role,
                        department: data.department || "",
                        employeeId: data.employee_id || data.roll_number || "",
                        joinedAt: data.created_at || "",
                    });
                } else {
                    router.push("/login");
                }
            } catch (err) {
                console.error("Error loading admin profile:", err);
                router.push("/login");
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    return { admin, loading };
}

// ── useStudentAuth: verifies the current user is a student ───────────────────
export function useStudentAuth() {
    const router = useRouter();
    const [student, setStudent] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                router.push("/login");
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    const role = data.role || "student";

                    if (role !== "student") {
                        router.push("/admin/dashboard");
                        return;
                    }

                    setStudent({
                        uid: firebaseUser.uid,
                        name: data.full_name || firebaseUser.displayName || "Student",
                        email: firebaseUser.email || "",
                        role,
                        department: data.department || "",
                        rollNumber: data.roll_number || "",
                        joinedAt: data.created_at || "",
                    });
                } else {
                    router.push("/login");
                }
            } catch (err) {
                console.error("Error loading student profile:", err);
                router.push("/login");
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    return { student, loading };
}

// ── useAllAchievements: real-time listener for ALL achievements ──────────────
export function useAllAchievements() {
    const [achievements, setAchievements] = useState<(Achievement & { adminRemark: string })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "achievements"),
            orderBy("created_at", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((docSnap) => {
                const d = docSnap.data();
                return {
                    id: docSnap.id,
                    title: d.title || "",
                    category: d.category || "Academic",
                    date: d.date || "",
                    description: d.description || "",
                    proof: d.proof_name || d.proof_url || "",
                    status: d.status || "pending",
                    points: d.points || 0,
                    adminRemark: d.admin_remark || "",
                    reviewedBy: d.reviewed_by || null,
                    reviewedAt: d.reviewed_at || null,
                    studentId: d.student_id || "",
                    studentName: d.student_name || "",
                    department: d.department || "",
                    submittedAt: d.submitted_at || "",
                } as Achievement & { adminRemark: string };
            });

            setAchievements(data);
            setLoading(false);
        }, (error) => {
            console.error("Error listening to achievements:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { achievements, loading };
}

// ── useStudentAchievements: real-time achievements for a specific student ────
export function useStudentAchievements(studentId: string | undefined) {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!studentId) return;

        const q = query(
            collection(db, "achievements"),
            orderBy("created_at", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs
                .map((docSnap) => {
                    const d = docSnap.data();
                    return {
                        id: docSnap.id,
                        title: d.title || "",
                        category: d.category || "Academic",
                        date: d.date || "",
                        description: d.description || "",
                        proof: d.proof_name || d.proof_url || "",
                        status: d.status || "pending",
                        points: d.points || 0,
                        reviewedBy: d.reviewed_by || null,
                        reviewedAt: d.reviewed_at || null,
                        studentId: d.student_id || "",
                        studentName: d.student_name || "",
                        department: d.department || "",
                        submittedAt: d.submitted_at || "",
                    } as Achievement;
                })
                .filter((a) => a.studentId === studentId);

            setAchievements(data);
            setLoading(false);
        }, (error) => {
            console.error("Error listening to student achievements:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [studentId]);

    return { achievements, loading };
}

// ── useAllUsers: real-time listener for all users with role=student ──────────
export function useAllUsers() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const data = snapshot.docs
                .map((docSnap) => {
                    const d = docSnap.data();
                    return {
                        uid: docSnap.id,
                        name: d.full_name || "",
                        email: d.email || "",
                        role: d.role || "student",
                        department: d.department || "",
                        rollNumber: d.roll_number || "",
                        employeeId: d.employee_id || "",
                        joinedAt: d.created_at || "",
                    } as UserProfile;
                })
                .filter((u) => u.role === "student");

            setUsers(data);
            setLoading(false);
        }, (error) => {
            console.error("Error listening to users:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { users, loading };
}

// ── Compute helpers (derive stats from achievements array) ───────────────────

const ALL_CATEGORIES: AchievementCategory[] = [
    "Academic", "Research", "Sports", "Cultural", "Co-Curricular", "Professional",
];

export function computeCategoryStats(achievements: Achievement[]): CategoryStats[] {
    return ALL_CATEGORIES.map((cat) => {
        const inCat = achievements.filter((a) => a.category === cat);
        return {
            category: cat,
            count: inCat.length,
            approved: inCat.filter((a) => a.status === "approved").length,
            pending: inCat.filter((a) => a.status === "pending").length,
            rejected: inCat.filter((a) => a.status === "rejected").length,
            points: inCat.reduce((s, a) => s + (a.status === "approved" ? a.points : 0), 0),
        };
    });
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function computeMonthlyStats(achievements: Achievement[]): MonthlyStats[] {
    const map = new Map<string, { total: number; approved: number; pending: number; rejected: number }>();

    for (const a of achievements) {
        if (!a.date) continue;
        const d = new Date(a.date);
        const key = MONTH_NAMES[d.getMonth()];
        if (!key) continue;
        const entry = map.get(key) || { total: 0, approved: 0, pending: 0, rejected: 0 };
        entry.total++;
        if (a.status === "approved") entry.approved++;
        else if (a.status === "pending") entry.pending++;
        else if (a.status === "rejected") entry.rejected++;
        map.set(key, entry);
    }

    // Return in calendar order
    return MONTH_NAMES
        .filter((m) => map.has(m))
        .map((m) => ({
            month: m,
            ...map.get(m)!,
        }));
}

export function computeDepartmentStats(achievements: Achievement[]): DepartmentStats[] {
    const deptMap = new Map<string, { students: Set<string>; total: number; approved: number; points: number }>();

    for (const a of achievements) {
        const dept = a.department || "Unknown";
        const entry = deptMap.get(dept) || { students: new Set(), total: 0, approved: 0, points: 0 };
        entry.students.add(a.studentId);
        entry.total++;
        if (a.status === "approved") {
            entry.approved++;
            entry.points += a.points;
        }
        deptMap.set(dept, entry);
    }

    return Array.from(deptMap.entries())
        .map(([dept, data]) => ({
            department: dept,
            totalStudents: data.students.size,
            totalAchievements: data.total,
            approvedAchievements: data.approved,
            totalPoints: data.points,
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints);
}

export function computeTopStudents(achievements: Achievement[]): TopStudent[] {
    const studentMap = new Map<string, { name: string; department: string; points: number; total: number; approved: number }>();

    for (const a of achievements) {
        const entry = studentMap.get(a.studentId) || {
            name: a.studentName,
            department: a.department,
            points: 0,
            total: 0,
            approved: 0,
        };
        entry.total++;
        if (a.status === "approved") {
            entry.approved++;
            entry.points += a.points;
        }
        studentMap.set(a.studentId, entry);
    }

    return Array.from(studentMap.entries())
        .map(([id, data]) => ({
            id,
            name: data.name,
            department: data.department,
            totalPoints: data.points,
            totalAchievements: data.total,
            approvedCount: data.approved,
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints);
}

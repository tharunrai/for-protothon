"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Trophy,
    BarChart2,
    FileText,
    Users,
    CheckSquare,
    PieChart,
    Home,
    ChevronRight,
    FileBarChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole, NavItem } from "@/types";

const studentNav: NavItem[] = [
    { label: "Dashboard", href: "/student/dashboard", icon: "LayoutDashboard" },
    { label: "Achievements", href: "/student/achievements", icon: "Trophy" },
    { label: "Analytics", href: "/student/analytics", icon: "BarChart2" },
];

const adminNav: NavItem[] = [
    { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
    { label: "Pending Approvals", href: "/admin/pending", icon: "CheckSquare" },
    { label: "All Achievements", href: "/admin/achievements", icon: "Trophy" },
    { label: "Analytics", href: "/admin/analytics", icon: "PieChart" },
    { label: "Reports", href: "/admin/reports", icon: "FileText" },
    { label: "NBA Report", href: "/admin/nba-report", icon: "FileBarChart" },
    { label: "Users", href: "/admin/users", icon: "Users" },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard,
    Trophy,
    BarChart2,
    FileText,
    Users,
    CheckSquare,
    PieChart,
    Home,
    FileBarChart,
};

function navForRole(role: UserRole): NavItem[] {
    if (role === "student") return studentNav;
    return adminNav;
}

interface SidebarProps {
    role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const navItems = navForRole(role);

    return (
        <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white min-h-screen">
            <nav className="flex-1 px-3 py-5 space-y-0.5">
                <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {role === "admin" ? "Administration" : "Student Portal"}
                </p>
                {navItems.map((item) => {
                    const Icon = iconMap[item.icon] || LayoutDashboard;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all relative",
                                isActive
                                    ? "bg-[#20376b]/8 text-[#20376b] font-semibold before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.5 before:rounded-full before:bg-[#20376b]"
                                    : "text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-4 w-4 shrink-0 transition-colors",
                                    isActive ? "text-[#20376b]" : "text-slate-400 group-hover:text-slate-600"
                                )}
                            />
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge && item.badge > 0 ? (
                                <span className="ml-auto flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold px-1">
                                    {item.badge}
                                </span>
                            ) : null}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer branding */}
            <div className="px-4 py-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    Sahyadri College · NBA Criterion 4
                </p>
            </div>
        </aside>
    );
}

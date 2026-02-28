import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { User, UserRole } from "@/types";

interface DashboardLayoutProps {
    user: User;
    role: UserRole;
    children: React.ReactNode;
    pendingCount?: number;
}

export function DashboardLayout({ user, role, children, pendingCount }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar user={user} pendingCount={pendingCount} />
            <div className="flex flex-1">
                <Sidebar role={role} />
                <main className="flex-1 p-6 lg:p-8 max-w-full overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}

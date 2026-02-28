import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Trophy, BarChart2, CheckCircle, Users, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Trophy,
    title: "Track Achievements",
    description: "Submit and monitor academic, research, sports, and co-curricular achievements seamlessly.",
    color: "text-[#20376b]",
    bg: "bg-[#20376b]/8",
  },
  {
    icon: BarChart2,
    title: "Analytics Dashboard",
    description: "Comprehensive charts and reports for data-driven insights on student performance.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    icon: CheckCircle,
    title: "Faculty Approval",
    description: "Streamlined approval workflow for faculty to review and validate student achievements.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    description: "Separate dashboards for students, faculty, and administrators with role-based permissions.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Shield,
    title: "NBA Compliance",
    description: "Fully aligned with NBA Criterion 4 requirements for institutional accreditation.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: Award,
    title: "Point System",
    description: "Weighted points system to quantify and rank student achievements across categories.",
    color: "text-[#ef7f1a]",
    bg: "bg-orange-50",
  },
];

const stats = [
  { value: "1,200+", label: "Students Enrolled" },
  { value: "4,800+", label: "Achievements Logged" },
  { value: "98%", label: "Approval Rate" },
  { value: "6", label: "Achievement Categories" },
];

export const dynamic = "force-static";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" width={155} height={38} className="h-9 w-auto" alt="Sahyadri College Logo" priority />
            <div className="hidden sm:block pl-3 border-l border-slate-200">
              <p className="text-xs font-semibold text-[#20376b] leading-tight">NBA Criterion 4</p>
              <p className="text-[10px] text-slate-400 leading-tight">Achievement Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-[#20376b]">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-[#20376b] hover:bg-[#1a2d54] text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-[#20376b]/5 to-white py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(32,55,107,0.07),_transparent_70%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[#20376b]/8 border border-[#20376b]/15 rounded-full px-4 py-1.5 text-xs font-medium text-[#20376b] mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#20376b]" />
            NBA Accreditation – Criterion 4 Compliance
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
            Student Achievement
            <br />
            <span className="text-[#20376b]">Management System</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            A unified platform for tracking, approving, and analyzing student achievements
            across academic, research, sports, cultural, and professional domains.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login">
              <Button size="lg" className="bg-[#20376b] hover:bg-[#1a2d54] text-white px-8 gap-2">
                Access Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="px-8 border-slate-300 text-slate-700 hover:border-[#20376b]/40 hover:text-[#20376b]">
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-[#20376b]">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Everything you need for Criterion 4
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Built specifically for engineering colleges to meet NBA accreditation requirements efficiently.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className={`inline-flex rounded-lg p-2.5 ${f.bg} mb-4`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-based access */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Role-Based Dashboards</h2>
            <p className="mt-3 text-slate-500 text-sm max-w-lg mx-auto">
              Tailored experience for every stakeholder in the achievement lifecycle.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              { role: "Student", href: "/student/dashboard", desc: "Submit achievements, track status, view analytics" },
              { role: "Admin", href: "/admin/dashboard", desc: "System-wide analytics, approvals, reporting, and user management" },
            ].map((r) => (
              <Link key={r.role} href={r.href} className="group block rounded-xl border border-slate-200 bg-slate-50 p-6 hover:shadow-md hover:border-[#20376b]/30 transition-all">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">{r.role} Dashboard</p>
                <p className="text-sm text-slate-600">{r.desc}</p>
                <div className="mt-4 flex items-center text-xs font-medium text-[#20376b] group-hover:gap-2 gap-1 transition-all">
                  View Dashboard <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#20376b]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to streamline student achievement tracking?
          </h2>
          <p className="text-[#94aed4] text-sm mb-8">
            Join hundreds of faculty and thousands of students already using the platform.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-[#20376b] hover:bg-[#20376b]/5 px-10">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" width={100} height={25} className="h-6 w-auto" alt="Sahyadri College" />
            <span className="text-xs text-slate-400">NBA Criterion 4 Achievement Management System</span>
          </div>
          <p className="text-xs text-slate-400">© 2025 Sahyadri College of Engineering &amp; Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

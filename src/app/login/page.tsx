"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Role = "student" | "admin";

const roles: { value: Role; label: string; href: string }[] = [
    { value: "student", label: "Student", href: "/student/dashboard" },
    { value: "admin", label: "Administrator", href: "/admin/dashboard" },
];

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<Role>("student");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const e: typeof errors = {};
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address.";
        if (!password || password.length < 6) e.password = "Password must be at least 6 characters.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        const target = roles.find((r) => r.value === role)?.href ?? "/student/dashboard";
        window.location.href = target;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#20376b] to-[#1a2d54] flex-col justify-between p-12">
                <div>
                    <div className="flex items-center gap-3">
                        <Image src="/logo.svg" width={155} height={38} className="h-10 w-auto brightness-0 invert" alt="Sahyadri College" />
                    </div>
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold text-white leading-snug">
                            Track, Approve &<br />Analyze Achievements
                        </h2>
                        <p className="mt-4 text-[#94aed4] text-sm leading-relaxed max-w-sm">
                            A comprehensive platform for managing student achievements in compliance with NBA Criterion 4 requirements.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { v: "1,200+", l: "Students" },
                        { v: "4,800+", l: "Achievements" },
                        { v: "98%", l: "Approval Rate" },
                        { v: "6", l: "Categories" },
                    ].map((s) => (
                        <div key={s.l} className="bg-white/10 rounded-lg p-4">
                            <p className="text-xl font-bold text-white">{s.v}</p>
                            <p className="text-xs text-[#94aed4] mt-0.5">{s.l}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    <div className="mb-8 text-center">
                        <div className="flex lg:hidden items-center gap-2 justify-center mb-4">
                            <Image src="/logo.svg" width={155} height={38} className="h-9 w-auto" alt="Sahyadri College" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
                        <p className="mt-1 text-sm text-slate-500">Sign in to your account</p>
                    </div>

                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Role Selector */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-slate-700">Login as</Label>
                                    <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-lg">
                                        {roles.map((r) => (
                                            <button
                                                key={r.value}
                                                type="button"
                                                onClick={() => setRole(r.value)}
                                                className={cn(
                                                    "py-1.5 px-2 rounded-md text-xs font-medium transition-all",
                                                    role === r.value
                                                        ? "bg-white text-[#20376b] shadow-sm"
                                                        : "text-slate-500 hover:text-slate-700"
                                                )}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs font-medium text-slate-700">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@college.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={cn("h-9 text-sm", errors.email && "border-red-400")}
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-xs font-medium text-slate-700">Password</Label>
                                        <a href="#" className="text-xs text-[#20376b] hover:underline">Forgot password?</a>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={cn("h-9 text-sm pr-10", errors.password && "border-red-400")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                                </div>

                                <Button type="submit" disabled={loading} className="w-full bg-[#20376b] hover:bg-[#1a2d54] text-white h-9">
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                            Signing in...
                                        </span>
                                    ) : "Sign In"}
                                </Button>

                                {/* Quick demo logins */}
                                <div className="pt-1 text-center">
                                    <p className="text-[10px] text-slate-400 mb-2">Quick Demo Access:</p>
                                    <div className="flex gap-2 justify-center">
                                        {roles.map((r) => (
                                            <Link key={r.href} href={r.href} className="text-[10px] text-[#20376b] hover:underline">
                                                {r.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="mt-5 text-center text-xs text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-[#20376b] font-medium hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

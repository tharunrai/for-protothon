"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Role = "student";

export default function RegisterPage() {
    const [role, setRole] = useState<Role>("student");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", id: "", department: "", password: "", confirm: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const departments = ["Computer Science & Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"];

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim() || form.name.length < 3) e.name = "Full name is required (min 3 chars).";
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid institutional email required.";
        if (!form.id.trim()) e.id = `${role === "student" ? "Roll Number" : "Employee ID"} is required.`;
        if (!form.department) e.department = "Please select your department.";
        if (!form.password || form.password.length < 8) e.password = "Password must be at least 8 characters.";
        if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        setLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="text-center max-w-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-4">
                        <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Registration Successful!</h2>
                    <p className="mt-2 text-sm text-slate-500">Your account is pending admin approval. You'll receive a confirmation email shortly.</p>
                    <Link href="/login">
                        <Button className="mt-6 bg-[#20376b] hover:bg-[#1a2d54] text-white">Go to Login</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-5">
                        <Image src="/logo.svg" width={155} height={38} className="h-9 w-auto" alt="Sahyadri College" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
                    <p className="mt-1 text-sm text-slate-500">Register to access the achievement management system</p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Role Toggle */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-slate-700">Register as</Label>
                                <div className="grid grid-cols-1 gap-1.5 bg-slate-100 p-1 rounded-lg">
                                    {(["student"] as Role[]).map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setRole(r)}
                                            className={cn(
                                                "py-1.5 rounded-md text-xs font-medium transition-all capitalize",
                                                role === r ? "bg-white text-[#20376b] shadow-sm" : "text-slate-500 hover:text-slate-700"
                                            )}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-slate-700">Full Name <span className="text-red-500">*</span></Label>
                                <Input placeholder="Dr. Ramesh Kumar / Arjun Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={cn("h-9 text-sm", errors.name && "border-red-400")} />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-slate-700">Institutional Email <span className="text-red-500">*</span></Label>
                                <Input type="email" placeholder="you@college.edu" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={cn("h-9 text-sm", errors.email && "border-red-400")} />
                                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                            </div>

                            {/* Roll / Employee ID + Department row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-slate-700">
                                        {role === "student" ? "Roll Number" : "Employee ID"} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input placeholder={role === "student" ? "20CS001" : "EMP101"} value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className={cn("h-9 text-sm", errors.id && "border-red-400")} />
                                    {errors.id && <p className="text-xs text-red-500">{errors.id}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-slate-700">Department <span className="text-red-500">*</span></Label>
                                    <select
                                        value={form.department}
                                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                                        className={cn(
                                            "w-full h-9 rounded-md border bg-white px-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#20376b]",
                                            errors.department ? "border-red-400" : "border-slate-200"
                                        )}
                                    >
                                        <option value="">Select dept.</option>
                                        {departments.map((d) => <option key={d} value={d}>{d.split(" ")[0]}</option>)}
                                    </select>
                                    {errors.department && <p className="text-xs text-red-500">{errors.department}</p>}
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-slate-700">Password <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={cn("h-9 text-sm pr-10", errors.password && "border-red-400")} />
                                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-slate-700">Confirm Password <span className="text-red-500">*</span></Label>
                                <Input type="password" placeholder="Re-enter password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className={cn("h-9 text-sm", errors.confirm && "border-red-400")} />
                                {errors.confirm && <p className="text-xs text-red-500">{errors.confirm}</p>}
                            </div>

                            <Button type="submit" disabled={loading} className="w-full bg-[#20376b] hover:bg-[#1a2d54] text-white h-9">
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        Creating account...
                                    </span>
                                ) : "Create Account"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-5 text-center text-xs text-slate-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#20376b] font-medium hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

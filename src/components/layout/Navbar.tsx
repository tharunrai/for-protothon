"use client";

import Link from "next/link";
import Image from "next/image";
import {
    Bell,
    Search,
    User,
    LogOut,
    Settings,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { User as UserType } from "@/types";

interface NavbarProps {
    user: UserType;
    pendingCount?: number;
}

export function Navbar({ user, pendingCount = 0 }: NavbarProps) {
    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
            <div className="flex h-16 items-center gap-4 px-6">
                {/* College Logo */}
                <Link href="/" className="flex items-center gap-3 mr-2 shrink-0">
                    <Image
                        src="/logo.svg"
                        alt="Sahyadri College"
                        width={155}
                        height={38}
                        className="h-9 w-auto"
                        priority
                    />
                </Link>

                {/* Divider */}
                <div className="hidden lg:block h-8 w-px bg-slate-200" />

                {/* System title */}
                <div className="hidden lg:block">
                    <p className="text-[11px] font-bold text-[#20376b] uppercase tracking-widest leading-tight">
                        NBA Criterion 4
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight">
                        Achievement Management System
                    </p>
                </div>

                {/* Search */}
                <div className="relative flex-1 max-w-xs hidden md:block ml-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                        placeholder="Search achievements..."
                        className="pl-9 h-8 text-sm bg-slate-50 border-slate-200 focus:bg-white rounded-md"
                    />
                </div>

                <div className="ml-auto md:ml-2 flex items-center gap-1.5">
                    {/* Role badge */}
                    <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#20376b]/10 text-[#20376b]">
                        {user.role}
                    </span>

                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative h-8 w-8 text-slate-500 hover:text-[#20376b] hover:bg-slate-50">
                        <Bell className="h-4 w-4" />
                        {pendingCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#20376b] flex items-center justify-center text-[9px] font-bold text-white">
                                {pendingCount > 9 ? "9+" : pendingCount}
                            </span>
                        )}
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 h-8 px-2 hover:bg-slate-50"
                            >
                                <Avatar className="h-7 w-7 border border-slate-200">
                                    <AvatarFallback className="bg-[#20376b]/10 text-[#20376b] text-xs font-semibold">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden sm:block text-left">
                                    <p className="text-xs font-medium text-slate-800 leading-tight">
                                        {user.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 capitalize leading-tight">
                                        {user.department || user.role}
                                    </p>
                                </div>
                                <ChevronDown className="h-3 w-3 text-slate-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel>
                                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                                <p className="text-xs text-slate-500 font-normal mt-0.5">
                                    {user.email}
                                </p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-slate-700">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-slate-700">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                                asChild
                            >
                                <Link href="/login">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

"use client";

import { useState } from "react";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AchievementStatus } from "@/types";

export interface Column<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    render?: (value: unknown, row: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    searchable?: boolean;
    searchPlaceholder?: string;
    searchKey?: keyof T;
    pagination?: boolean;
    pageSize?: number;
    className?: string;
}

export function DataTable<T>({
    columns,
    data,
    searchable = false,
    searchPlaceholder = "Search...",
    searchKey,
    pagination = true,
    pageSize = 8,
    className,
}: DataTableProps<T>) {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(0);

    const filtered = searchable && searchKey
        ? data.filter((row) => {
            const val = row[searchKey];
            return String(val).toLowerCase().includes(search.toLowerCase());
        })
        : data;

    const sorted = sortKey
        ? [...filtered].sort((a, b) => {
            const aVal = String((a as Record<string, unknown>)[sortKey] ?? "");
            const bVal = String((b as Record<string, unknown>)[sortKey] ?? "");
            return sortDir === "asc"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        })
        : filtered;

    const totalPages = Math.ceil(sorted.length / pageSize);
    const paged = pagination ? sorted.slice(page * pageSize, (page + 1) * pageSize) : sorted;

    const handleSort = (key: string, sortable?: boolean) => {
        if (!sortable) return;
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
        setPage(0);
    };

    const getCellValue = (row: T, key: string): unknown => {
        return (row as Record<string, unknown>)[key];
    };

    return (
        <div className={cn("space-y-3", className)}>
            {searchable && (
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        className="pl-9 h-9 bg-slate-50 text-sm"
                    />
                </div>
            )}

            <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    onClick={() => handleSort(String(col.key), col.sortable)}
                                    className={cn(
                                        "px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap",
                                        col.sortable && "cursor-pointer select-none hover:text-slate-700",
                                        col.className
                                    )}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && (
                                            <span className="flex flex-col">
                                                <ChevronUp className={cn("h-2.5 w-2.5", sortKey === col.key && sortDir === "asc" ? "text-[#20376b]" : "text-slate-300")} />
                                                <ChevronDown className={cn("h-2.5 w-2.5 -mt-0.5", sortKey === col.key && sortDir === "desc" ? "text-[#20376b]" : "text-slate-300")} />
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paged.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-slate-400">
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            paged.map((row, idx) => (
                                <tr key={(row as { id?: string }).id ?? idx} className="hover:bg-slate-50 transition-colors">
                                    {columns.map((col) => (
                                        <td key={String(col.key)} className={cn("px-4 py-3 text-slate-700", col.className)}>
                                            {col.render
                                                ? col.render(getCellValue(row, String(col.key)), row)
                                                : String(getCellValue(row, String(col.key)) ?? "-")}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && totalPages > 1 && (
                <div className="flex items-center justify-between px-1">
                    <p className="text-xs text-slate-500">
                        Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Button
                                key={i}
                                size="icon"
                                variant={i === page ? "default" : "outline"}
                                className="h-7 w-7 text-xs"
                                onClick={() => setPage(i)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Status badge helper
export function StatusBadge({ status }: { status: AchievementStatus }) {
    const map = {
        approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
        pending: "bg-amber-50 text-amber-700 border-amber-200",
        rejected: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return (
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border", map[status])}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

// Category badge helper
export function CategoryBadge({ category }: { category: string }) {
    const map: Record<string, string> = {
        Academic: "bg-[#20376b]/8 text-[#20376b]",
        Research: "bg-teal-50 text-teal-700",
        Sports: "bg-emerald-50 text-emerald-700",
        Cultural: "bg-rose-50 text-rose-700",
        "Co-Curricular": "bg-sky-50 text-sky-700",
        Professional: "bg-amber-50 text-amber-700",
    };
    return (
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold", map[category] ?? "bg-slate-100 text-slate-700")}>
            {category}
        </span>
    );
}


// User Types
export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
  rollNumber?: string;
  employeeId?: string;
  joinedAt: string;
}

// Achievement Types
export type AchievementStatus = "pending" | "approved" | "rejected";
export type AchievementCategory =
  | "Academic"
  | "Research"
  | "Sports"
  | "Cultural"
  | "Co-Curricular"
  | "Professional";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  status: AchievementStatus;
  studentId: string;
  studentName: string;
  department: string;
  date: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  points: number;
  proof?: string;
}

// Analytics Types
export interface CategoryStats {
  category: AchievementCategory;
  count: number;
  approved: number;
  pending: number;
  rejected: number;
  points: number;
}

export interface MonthlyStats {
  month: string;
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export interface DepartmentStats {
  department: string;
  totalStudents: number;
  totalAchievements: number;
  approvedAchievements: number;
  totalPoints: number;
}

export interface TopStudent {
  id: string;
  name: string;
  department: string;
  totalPoints: number;
  totalAchievements: number;
  approvedCount: number;
  avatar?: string;
}

// Report Types
export interface ReportFilter {
  department: string;
  category: AchievementCategory | "All";
  status: AchievementStatus | "All";
  fromDate: string;
  toDate: string;
  sortBy: "date" | "points" | "name";
}

// Nav Types
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

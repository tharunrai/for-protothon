import {
    User,
    Achievement,
    CategoryStats,
    MonthlyStats,
    DepartmentStats,
    TopStudent,
} from "@/types";

export const currentStudent: User = {
    id: "STU001",
    name: "Arjun Sharma",
    email: "arjun.sharma@college.edu",
    role: "student",
    department: "Computer Science & Engineering",
    rollNumber: "20CS001",
    joinedAt: "2022-08-01",
};

export const currentFaculty: User = {
    id: "FAC001",
    name: "Dr. Priya Nair",
    email: "priya.nair@college.edu",
    role: "admin",
    department: "Computer Science & Engineering",
    employeeId: "EMP101",
    joinedAt: "2018-06-15",
};

export const currentAdmin: User = {
    id: "ADM001",
    name: "Prof. Ramesh Kumar",
    email: "ramesh.kumar@college.edu",
    role: "admin",
    department: "Administration",
    employeeId: "ADM001",
    joinedAt: "2015-01-10",
};

export const students: User[] = [
    currentStudent,
    {
        id: "STU002",
        name: "Meera Patel",
        email: "meera.patel@college.edu",
        role: "student",
        department: "Electronics & Communication",
        rollNumber: "20EC015",
        joinedAt: "2022-08-01",
    },
    {
        id: "STU003",
        name: "Rahul Verma",
        email: "rahul.verma@college.edu",
        role: "student",
        department: "Computer Science & Engineering",
        rollNumber: "20CS034",
        joinedAt: "2022-08-01",
    },
    {
        id: "STU004",
        name: "Sneha Rao",
        email: "sneha.rao@college.edu",
        role: "student",
        department: "Mechanical Engineering",
        rollNumber: "20ME022",
        joinedAt: "2022-08-01",
    },
    {
        id: "STU005",
        name: "Kiran Joshi",
        email: "kiran.joshi@college.edu",
        role: "student",
        department: "Civil Engineering",
        rollNumber: "20CE008",
        joinedAt: "2022-08-01",
    },
];

export const achievements: Achievement[] = [
    {
        id: "ACH001",
        title: "National Hackathon Winner - Smart India Hackathon 2024",
        description:
            "Developed an AI-powered crop disease detection system using computer vision. Won first place among 5000+ teams nationwide.",
        category: "Co-Curricular",
        status: "approved",
        studentId: "STU001",
        studentName: "Arjun Sharma",
        department: "Computer Science & Engineering",
        date: "2024-09-15",
        submittedAt: "2024-09-20",
        reviewedBy: "Dr. Priya Nair",
        reviewedAt: "2024-09-22",
        points: 100,
        proof: "SIH2024_certificate.pdf",
    },
    {
        id: "ACH002",
        title: "Research Paper Published in IEEE Xplore",
        description:
            "Published research paper titled 'Federated Learning for Healthcare Data Privacy' in IEEE International Conference on AI.",
        category: "Research",
        status: "approved",
        studentId: "STU001",
        studentName: "Arjun Sharma",
        department: "Computer Science & Engineering",
        date: "2024-07-10",
        submittedAt: "2024-07-15",
        reviewedBy: "Dr. Priya Nair",
        reviewedAt: "2024-07-18",
        points: 80,
        proof: "ieee_paper.pdf",
    },
    {
        id: "ACH003",
        title: "State Level Chess Championship - Runner Up",
        description:
            "Secured 2nd place in the State Level Intercollegiate Chess Championship held at Mysore University.",
        category: "Sports",
        status: "pending",
        studentId: "STU001",
        studentName: "Arjun Sharma",
        department: "Computer Science & Engineering",
        date: "2024-11-05",
        submittedAt: "2024-11-10",
        points: 50,
    },
    {
        id: "ACH004",
        title: "Google Cloud Professional Developer Certification",
        description:
            "Achieved Google Cloud Professional Cloud Developer certification after rigorous examination.",
        category: "Professional",
        status: "pending",
        studentId: "STU001",
        studentName: "Arjun Sharma",
        department: "Computer Science & Engineering",
        date: "2024-10-20",
        submittedAt: "2024-10-25",
        points: 60,
        proof: "gcp_cert.pdf",
    },
    {
        id: "ACH005",
        title: "Best Paper Award - National Symposium on AI",
        description:
            "Received best paper award at national symposium for the research on Large Language Models.",
        category: "Research",
        status: "approved",
        studentId: "STU002",
        studentName: "Meera Patel",
        department: "Electronics & Communication",
        date: "2024-08-20",
        submittedAt: "2024-08-25",
        reviewedBy: "Dr. Priya Nair",
        reviewedAt: "2024-08-28",
        points: 75,
    },
    {
        id: "ACH006",
        title: "Inter-University Badminton - Gold Medal",
        description:
            "Won gold medal in singles badminton at the All India Inter-University Sports Meet 2024.",
        category: "Sports",
        status: "approved",
        studentId: "STU003",
        studentName: "Rahul Verma",
        department: "Computer Science & Engineering",
        date: "2024-10-01",
        submittedAt: "2024-10-05",
        reviewedBy: "Dr. Priya Nair",
        reviewedAt: "2024-10-07",
        points: 90,
    },
    {
        id: "ACH007",
        title: "Cultural Fest - Best Drama Performance",
        description:
            "Won best actor award at the Annual National Cultural Fest - NatyaRang 2024.",
        category: "Cultural",
        status: "rejected",
        studentId: "STU004",
        studentName: "Sneha Rao",
        department: "Mechanical Engineering",
        date: "2024-09-01",
        submittedAt: "2024-09-10",
        reviewedBy: "Dr. Priya Nair",
        reviewedAt: "2024-09-12",
        points: 40,
    },
    {
        id: "ACH008",
        title: "Academic Excellence Award - Topper of Semester",
        description:
            "Secured 9.8 CGPA - highest in the department for the academic year 2023-24.",
        category: "Academic",
        status: "approved",
        studentId: "STU005",
        studentName: "Kiran Joshi",
        department: "Civil Engineering",
        date: "2024-06-01",
        submittedAt: "2024-06-05",
        reviewedBy: "Dr. Priya Nair",
        reviewedAt: "2024-06-07",
        points: 70,
    },
];

export const categoryStats: CategoryStats[] = [
    { category: "Academic", count: 42, approved: 38, pending: 3, rejected: 1, points: 2940 },
    { category: "Research", count: 35, approved: 30, pending: 4, rejected: 1, points: 2450 },
    { category: "Sports", count: 58, approved: 50, pending: 5, rejected: 3, points: 4060 },
    { category: "Cultural", count: 28, approved: 22, pending: 4, rejected: 2, points: 1120 },
    { category: "Co-Curricular", count: 47, approved: 40, pending: 5, rejected: 2, points: 4700 },
    { category: "Professional", count: 31, approved: 26, pending: 4, rejected: 1, points: 1860 },
];

export const monthlyStats: MonthlyStats[] = [
    { month: "Aug", total: 18, approved: 14, pending: 3, rejected: 1 },
    { month: "Sep", total: 24, approved: 19, pending: 4, rejected: 1 },
    { month: "Oct", total: 31, approved: 25, pending: 5, rejected: 1 },
    { month: "Nov", total: 28, approved: 22, pending: 4, rejected: 2 },
    { month: "Dec", total: 15, approved: 12, pending: 2, rejected: 1 },
    { month: "Jan", total: 22, approved: 17, pending: 4, rejected: 1 },
    { month: "Feb", total: 35, approved: 27, pending: 6, rejected: 2 },
    { month: "Mar", total: 41, approved: 33, pending: 6, rejected: 2 },
    { month: "Apr", total: 38, approved: 30, pending: 6, rejected: 2 },
    { month: "May", total: 20, approved: 16, pending: 3, rejected: 1 },
];

export const departmentStats: DepartmentStats[] = [
    { department: "CSE", totalStudents: 240, totalAchievements: 98, approvedAchievements: 82, totalPoints: 8200 },
    { department: "ECE", totalStudents: 180, totalAchievements: 72, approvedAchievements: 60, totalPoints: 5400 },
    { department: "ME", totalStudents: 160, totalAchievements: 55, approvedAchievements: 44, totalPoints: 3850 },
    { department: "CE", totalStudents: 140, totalAchievements: 48, approvedAchievements: 38, totalPoints: 2990 },
    { department: "EEE", totalStudents: 120, totalAchievements: 40, approvedAchievements: 32, totalPoints: 2480 },
];

export const topStudents: TopStudent[] = [
    { id: "STU001", name: "Arjun Sharma", department: "CSE", totalPoints: 240, totalAchievements: 4, approvedCount: 2 },
    { id: "STU003", name: "Rahul Verma", department: "CSE", totalPoints: 220, totalAchievements: 5, approvedCount: 4 },
    { id: "STU002", name: "Meera Patel", department: "ECE", totalPoints: 195, totalAchievements: 4, approvedCount: 3 },
    { id: "STU005", name: "Kiran Joshi", department: "CE", totalPoints: 180, totalAchievements: 3, approvedCount: 3 },
    { id: "STU004", name: "Sneha Rao", department: "ME", totalPoints: 155, totalAchievements: 4, approvedCount: 2 },
];

export const pendingAchievements = achievements.filter(
    (a) => a.status === "pending"
);

export const myAchievements = achievements.filter(
    (a) => a.studentId === "STU001"
);

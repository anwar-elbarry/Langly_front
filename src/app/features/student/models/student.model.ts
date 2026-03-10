import { Level } from '../../admin/models/enums';

// Active courses
export interface ActiveCourseResponse {
    courseId: string;
    courseName: string;
    courseCode: string;
    language: string;
    teacherFullName: string;
    upcomingSessions: UpcomingSession[];
}

export interface UpcomingSession {
    sessionId: string;
    title: string;
    scheduledAt: string;
    durationMinutes: number;
    mode: string;
    room?: string;
    meetingLink?: string;
}

// Checkout
export interface CheckoutRequest {
    courseId: string;
    level: Level;
}

export interface CheckoutResponse {
    checkoutUrl: string;
    billingId: string;
}

// Attendance
export interface MarkAttendanceRequest {
    sessionId: string;
    qrToken: string;
}

export interface AttendanceResponse {
    id: string;
    studentId: string;
    studentFullName: string;
    status: string;
    markedAt: string;
    sessionId: string;
}

// Course Material
export interface CourseMaterialResponse {
    id: string;
    name: string;
    type: string;
    fileUrl: string;
    uploadedAt: string;
    courseId: string;
}

// Certification
export interface CertificationResponse {
    id: string;
    language: string;
    level: string;
    issuedAt: string;
    pdfUrl: string;
    courseName: string;
    schoolName: string;
}

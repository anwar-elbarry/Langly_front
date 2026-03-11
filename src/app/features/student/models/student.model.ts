
// Active courses
export interface ActiveCourseResponse {
    id: string;
    name: string;
    code: string;
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

// Enrollment request
export interface StudentEnrollmentRequest {
    courseId: string;
}

// Payment
export interface PaymentMethodSelection {
    paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'STRIPE';
}

export interface PaymentResponse {
    billing: import('../../admin/models/billing.model').BillingResponse;
    checkoutUrl?: string;
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

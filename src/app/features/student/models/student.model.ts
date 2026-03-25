
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

// Attendance Summary
export interface StudentAttendanceSummaryResponse {
    totalSessions: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    unmarked: number;
}

export interface CourseAttendanceSummaryResponse {
    courseId: string;
    courseName: string;
    totalSessions: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    unmarked: number;
}

// Fees
export interface StudentFeeStatusResponse {
    feeTemplateId: string;
    feeTemplateName: string;
    feeType: string;
    feeAmount: number;
    isRecurring: boolean;
    totalPaid: number;
    paymentCount: number;
    isClosed: boolean;
    status: string;
}

export interface StudentFeeCatalogResponse {
    id: string;
    name: string;
    type: string;
    amount: number;
    isRecurring: boolean;
    isActive: boolean;
    schoolId: string;
}

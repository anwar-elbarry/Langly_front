import { Level, EnrollmentStatus } from '../../admin/models/enums';

// Teacher overview / dashboard stats
export interface TeacherOverviewResponse {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  upcomingSessions: number;
  pendingGrading: number;
}

// Session
export interface SessionResponse {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  scheduledAt: string;
  mode: 'ONLINE' | 'IN_PERSON' | 'HYBRID';
  room: string;
  meetingLink: string;
  courseId: string;
}

export interface SessionRequest {
  title: string;
  description?: string;
  durationMinutes: number;
  scheduledAt: string;
  mode: 'ONLINE' | 'IN_PERSON' | 'HYBRID';
  room?: string;
  meetingLink?: string;
  courseId: string;
}

// QR code
export interface QrCodeResponse {
  qrToken: string;
  expiresAt: string;
}

// Attendance
export interface AttendanceResponse {
  id: string;
  studentId: string;
  studentFullName: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  markedAt: string;
  sessionId: string;
}

// Course material
export interface CourseMaterialResponse {
  id: string;
  name: string;
  type: 'PDF' | 'VIDEO';
  fileUrl: string;
  uploadedAt: string;
  courseId: string;
}

// Student enrollment (for teacher's course view)
export interface StudentEnrollmentResponse {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  level: Level;
  enrollmentId: string;
  enrollmentStatus: EnrollmentStatus;
  enrolledAt: string;
}

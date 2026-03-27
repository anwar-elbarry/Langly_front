import { Level, EnrollmentStatus, Mode, AttendanceStatus } from '../../../shared/models/enums';

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
  mode: Mode;
  room: string;
  meetingLink: string;
  courseId: string;
  presentCount: number;
  totalEnrolled: number;
}

export interface SessionRequest {
  title: string;
  description?: string;
  durationMinutes: number;
  scheduledAt: string;
  mode: Mode;
  room?: string;
  meetingLink?: string;
  courseId: string;
}

// QR code
// Attendance
export interface AttendanceResponse {
  id: string | null;
  studentId: string;
  studentFullName: string;
  status: AttendanceStatus;
  markedAt: string | null;
  sessionId: string;
}

export interface ManualAttendanceRequest {
  studentId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
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

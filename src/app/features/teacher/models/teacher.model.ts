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
  presentCount: number;
  totalEnrolled: number;
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
// Attendance
export interface AttendanceResponse {
  id: string | null;
  studentId: string;
  studentFullName: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'UNMARKED';
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

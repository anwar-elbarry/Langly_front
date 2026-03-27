import { EnrollmentStatus, Level } from '../../../shared/models/enums';

export interface EnrollmentResponse {
  id: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  leftAt: string;
  certificateIssued: boolean;
  studentId: string;
  studentFullName: string;
  courseId: string;
  courseName: string;
  level: Level;
}

export interface EnrollmentRequest {
  studentId: string;
  courseId: string;
}

import { Level } from '../../../../shared/models/enums';

export interface CourseResponse {
  id: string;
  name: string;
  code: string;
  language: string;
  requiredLevel: Level;
  targetLevel: Level;
  startDate: string;
  endDate: string;
  isActive: boolean;
  price: number;
  capacity: number;
  sessionPerWeek: number;
  minutesPerSession: number;
  teacherId: string;
  teacherFullName: string;
  enrolledCount: number;
}

export interface CourseRequest {
  name: string;
  code: string;
  language: string;
  requiredLevel: Level;
  targetLevel: Level;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  sessionPerWeek: number;
  minutesPerSession?: number;
  teacherId: string;
  schoolId: string;
}

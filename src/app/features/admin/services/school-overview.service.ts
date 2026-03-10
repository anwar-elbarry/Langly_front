import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { SchoolUserService } from './school-user.service';
import { StudentService } from './student.service';
import { CourseService } from './course.service';
import { EnrollmentService } from './enrollment.service';
import { BillingService } from './billing.service';

export interface SchoolOverview {
  teacherCount: number;
  studentCount: number;
  activeCourseCount: number;
  pendingBillingCount: number;
  incompleteProfileCount: number;
  activeEnrollmentCount: number;
}

@Injectable({ providedIn: 'root' })
export class SchoolOverviewService {
  private userService = inject(SchoolUserService);
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private billingService = inject(BillingService);

  getOverview(schoolId: string): Observable<SchoolOverview> {
    return forkJoin({
      users: this.userService.getAllBySchool(schoolId),
      students: this.studentService.getAllBySchool(schoolId),
      courses: this.courseService.getAllBySchool(schoolId),
      enrollments: this.enrollmentService.getAllBySchool(schoolId),
      pendingBillings: this.billingService.getPending(schoolId),
      incompleteStudents: this.studentService.getIncomplete(schoolId),
    }).pipe(
      map(({ users, students, courses, enrollments, pendingBillings, incompleteStudents }) => ({
        teacherCount: users.filter(u => u.role?.name === 'TEACHER').length,
        studentCount: students.length,
        activeCourseCount: courses.filter(c => c.isActive).length,
        pendingBillingCount: pendingBillings.length,
        incompleteProfileCount: incompleteStudents.length,
        activeEnrollmentCount: enrollments.filter(e => e.status === 'IN_PROGRESS').length,
      }))
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ActiveCourseResponse } from '../models/student.model';
import { CourseResponse } from '../../admin/models/course.model';
import { EnrollmentResponse } from '../../admin/models/enrollment.model';

@Injectable({ providedIn: 'root' })
export class StudentCourseService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getActiveCourses(): Observable<ActiveCourseResponse[]> {
        return this.http.get<ActiveCourseResponse[]>(`${this.apiUrl}/v1/student/courses/active`);
    }

    requestEnrollment(courseId: string): Observable<EnrollmentResponse> {
        return this.http.post<EnrollmentResponse>(`${this.apiUrl}/v1/student/enrollments/request`, { courseId });
    }

    getMyEnrollments(): Observable<EnrollmentResponse[]> {
        return this.http.get<EnrollmentResponse[]>(`${this.apiUrl}/v1/student/enrollments`);
    }

    getInvoice(billingId: string): Observable<string> {
        return this.http.get(`${this.apiUrl}/v1/student/enrollments/${billingId}/invoice`, { responseType: 'text' });
    }

    getAllCourses(schoolId: string): Observable<CourseResponse[]> {
        return this.http.get<CourseResponse[]>(`${this.apiUrl}/v1/courses/school/${schoolId}`);
    }
}

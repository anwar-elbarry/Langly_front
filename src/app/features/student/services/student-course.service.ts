import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ActiveCourseResponse, CheckoutRequest, CheckoutResponse } from '../models/student.model';
import { CourseResponse } from '../../admin/models/course.model';

@Injectable({ providedIn: 'root' })
export class StudentCourseService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getActiveCourses(): Observable<ActiveCourseResponse[]> {
        return this.http.get<ActiveCourseResponse[]>(`${this.apiUrl}/v1/student/courses/active`);
    }

    checkout(req: CheckoutRequest): Observable<CheckoutResponse> {
        return this.http.post<CheckoutResponse>(`${this.apiUrl}/v1/student/enrollments/checkout`, req);
    }

    getInvoice(billingId: string): Observable<string> {
        return this.http.get(`${this.apiUrl}/v1/student/enrollments/${billingId}/invoice`, { responseType: 'text' });
    }

    getAllCourses(schoolId: string): Observable<CourseResponse[]> {
        return this.http.get<CourseResponse[]>(`${this.apiUrl}/v1/courses/school/${schoolId}`);
    }
}

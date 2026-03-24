import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { EnrollmentRequest, EnrollmentResponse } from '../models/enrollment.model';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/enrollments`;

  getAllBySchool(schoolId: string): Observable<EnrollmentResponse[]> {
    return this.http.get<EnrollmentResponse[]>(`${this.apiUrl}/school/${schoolId}`);
  }

  getById(id: string): Observable<EnrollmentResponse> {
    return this.http.get<EnrollmentResponse>(`${this.apiUrl}/${id}`);
  }

  getAllByStudent(studentId: string): Observable<EnrollmentResponse[]> {
    return this.http.get<EnrollmentResponse[]>(`${this.apiUrl}/student/${studentId}`);
  }

  getAllByCourse(courseId: string): Observable<EnrollmentResponse[]> {
    return this.http.get<EnrollmentResponse[]>(`${this.apiUrl}/course/${courseId}`);
  }

  enroll(payload: EnrollmentRequest): Observable<EnrollmentResponse> {
    return this.http.post<EnrollmentResponse>(this.apiUrl, payload);
  }

  approveEnrollment(id: string): Observable<EnrollmentResponse> {
    return this.http.patch<EnrollmentResponse>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectEnrollment(id: string): Observable<EnrollmentResponse> {
    return this.http.patch<EnrollmentResponse>(`${this.apiUrl}/${id}/reject`, {});
  }

  updateStatus(id: string, status: string): Observable<EnrollmentResponse> {
    return this.http.patch<EnrollmentResponse>(`${this.apiUrl}/${id}/status`, { status });
  }
}

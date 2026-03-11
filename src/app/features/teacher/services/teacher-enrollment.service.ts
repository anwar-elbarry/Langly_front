import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { EnrollmentResponse } from '../../admin/models/enrollment.model';

@Injectable({ providedIn: 'root' })
export class TeacherEnrollmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/enrollments`;

  getByCourse(courseId: string): Observable<EnrollmentResponse[]> {
    return this.http.get<EnrollmentResponse[]>(`${this.apiUrl}/course/${courseId}`);
  }

  updateStatus(enrollmentId: string, status: string): Observable<EnrollmentResponse> {
    return this.http.patch<EnrollmentResponse>(`${this.apiUrl}/${enrollmentId}/status`, { status });
  }
}

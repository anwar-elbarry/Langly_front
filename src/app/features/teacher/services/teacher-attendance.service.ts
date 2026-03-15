import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AttendanceResponse, ManualAttendanceRequest } from '../models/teacher.model';

@Injectable({ providedIn: 'root' })
export class TeacherAttendanceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/teacher/sessions`;

  getAttendance(sessionId: string): Observable<AttendanceResponse[]> {
    return this.http.get<AttendanceResponse[]>(`${this.apiUrl}/${sessionId}/attendance`);
  }

  getFullAttendance(sessionId: string): Observable<AttendanceResponse[]> {
    return this.http.get<AttendanceResponse[]>(`${this.apiUrl}/${sessionId}/attendance/full`);
  }

  markManual(sessionId: string, request: ManualAttendanceRequest): Observable<AttendanceResponse> {
    return this.http.put<AttendanceResponse>(`${this.apiUrl}/${sessionId}/attendance`, request);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AttendanceResponse, QrCodeResponse } from '../models/teacher.model';

@Injectable({ providedIn: 'root' })
export class TeacherAttendanceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/teacher/sessions`;

  generateQrCode(sessionId: string): Observable<QrCodeResponse> {
    return this.http.post<QrCodeResponse>(`${this.apiUrl}/${sessionId}/qr`, {});
  }

  getAttendance(sessionId: string): Observable<AttendanceResponse[]> {
    return this.http.get<AttendanceResponse[]>(`${this.apiUrl}/${sessionId}/attendance`);
  }
}

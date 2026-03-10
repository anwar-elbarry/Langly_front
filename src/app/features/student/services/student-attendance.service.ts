import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AttendanceResponse, MarkAttendanceRequest } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentAttendanceService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    /** Mark attendance via QR code */
    markAttendance(req: MarkAttendanceRequest): Observable<AttendanceResponse> {
        return this.http.post<AttendanceResponse>(`${this.apiUrl}/v1/student/attendance/mark`, req);
    }
}

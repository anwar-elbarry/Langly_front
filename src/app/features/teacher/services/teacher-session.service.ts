import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { SessionRequest, SessionResponse } from '../models/teacher.model';

@Injectable({ providedIn: 'root' })
export class TeacherSessionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/sessions`;

  getByCourse(courseId: string): Observable<SessionResponse[]> {
    return this.http.get<SessionResponse[]>(`${this.apiUrl}/course/${courseId}`);
  }

  getUpcoming(courseId: string): Observable<SessionResponse[]> {
    return this.http.get<SessionResponse[]>(`${this.apiUrl}/course/${courseId}/upcoming`);
  }

  create(payload: SessionRequest): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(this.apiUrl, payload);
  }

  update(id: string, payload: SessionRequest): Observable<SessionResponse> {
    return this.http.put<SessionResponse>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

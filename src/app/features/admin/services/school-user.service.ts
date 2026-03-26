import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { UserResponse } from '../../../features/auth/models/User.response';

export interface InviteRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  roleName: 'STUDENT' | 'TEACHER' | 'SCHOOL_ADMIN';
  schoolId: string;
}

@Injectable({ providedIn: 'root' })
export class SchoolUserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/users`;

  getAllBySchool(schoolId: string): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/school/${schoolId}`);
  }

  getTeachersBySchool(schoolId: string): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/school/${schoolId}/role/TEACHER`);
  }

  invite(payload: InviteRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, payload);
  }

  activate(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/activate`, {});
  }

  suspend(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/suspend`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

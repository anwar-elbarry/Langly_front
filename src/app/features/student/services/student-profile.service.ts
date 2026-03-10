import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { StudentProfileResponse, StudentProfileUpdateRequest } from '../models/student-profile.model';

@Injectable({ providedIn: 'root' })
export class StudentProfileService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/students`;

  getMyProfile(): Observable<StudentProfileResponse> {
    return this.http.get<StudentProfileResponse>(`${this.apiUrl}/me`);
  }

  updateMyProfile(request: StudentProfileUpdateRequest): Observable<StudentProfileResponse> {
    return this.http.patch<StudentProfileResponse>(`${this.apiUrl}/me`, request);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { StudentResponse } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/students`;

  getAllBySchool(schoolId: string): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(`${this.apiUrl}/school/${schoolId}`);
  }

  getById(id: string): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(`${this.apiUrl}/${id}`);
  }

  getIncomplete(schoolId: string): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(`${this.apiUrl}/school/${schoolId}/incomplete`);
  }
}

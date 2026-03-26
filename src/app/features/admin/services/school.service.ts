import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { SchoolResponse, SchoolUpdateRequest } from '../../superAdmin/models/school.model';

@Injectable({ providedIn: 'root' })
export class SchoolService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/schools`;

  getById(id: string): Observable<SchoolResponse> {
    return this.http.get<SchoolResponse>(`${this.apiUrl}/${id}`);
  }

  update(id: string, payload: SchoolUpdateRequest): Observable<SchoolResponse> {
    return this.http.put<SchoolResponse>(`${this.apiUrl}/${id}`, payload);
  }

  uploadLogo(id: string, file: File): Observable<SchoolResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<SchoolResponse>(`${this.apiUrl}/${id}/logo`, formData);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { SchoolRequest, SchoolResponse, SchoolUpdateRequest } from '../models/school.model';

@Injectable({ providedIn: 'root' })
export class SchoolsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/schools`;

  getAll(): Observable<SchoolResponse[]> {
    return this.http.get<SchoolResponse[]>(this.apiUrl);
  }

  getById(id: string): Observable<SchoolResponse> {
    return this.http.get<SchoolResponse>(`${this.apiUrl}/${id}`);
  }

  searchByName(name: string): Observable<SchoolResponse[]> {
    return this.http.get<SchoolResponse[]>(`${this.apiUrl}/search`, { params: { name } });
  }

  create(payload: SchoolRequest): Observable<SchoolResponse> {
    return this.http.post<SchoolResponse>(this.apiUrl, payload);
  }

  update(id: string, payload: SchoolUpdateRequest): Observable<SchoolResponse> {
    return this.http.put<SchoolResponse>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


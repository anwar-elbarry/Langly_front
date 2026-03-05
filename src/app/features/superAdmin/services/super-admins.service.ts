import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { SuperAdminRequest, SuperAdminResponse } from '../models/super-admin.model';

@Injectable({ providedIn: 'root' })
export class SuperAdminsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/super-admins`;

  getAll(): Observable<SuperAdminResponse[]> {
    return this.http.get<SuperAdminResponse[]>(this.apiUrl);
  }

  getById(id: string): Observable<SuperAdminResponse> {
    return this.http.get<SuperAdminResponse>(`${this.apiUrl}/${id}`);
  }

  create(payload: SuperAdminRequest): Observable<SuperAdminResponse> {
    return this.http.post<SuperAdminResponse>(this.apiUrl, payload);
  }

  update(id: string, payload: Partial<SuperAdminRequest>): Observable<SuperAdminResponse> {
    return this.http.put<SuperAdminResponse>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


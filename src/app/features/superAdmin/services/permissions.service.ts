import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { PermissionRequest, PermissionResponse } from '../models/permission.model';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/permissions`;

  getAll(): Observable<PermissionResponse[]> {
    return this.http.get<PermissionResponse[]>(this.apiUrl);
  }

  getById(id: string): Observable<PermissionResponse> {
    return this.http.get<PermissionResponse>(`${this.apiUrl}/${id}`);
  }

  create(payload: PermissionRequest): Observable<PermissionResponse> {
    return this.http.post<PermissionResponse>(this.apiUrl, payload);
  }

  createBatch(names: string[]): Observable<PermissionResponse[]> {
    return this.http.post<PermissionResponse[]>(`${this.apiUrl}/batch`, names);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


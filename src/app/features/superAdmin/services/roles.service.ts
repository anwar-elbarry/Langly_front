import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { RoleRequest, RoleResponse } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/roles`;

  getAll(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(this.apiUrl);
  }

  getById(id: string): Observable<RoleResponse> {
    return this.http.get<RoleResponse>(`${this.apiUrl}/${id}`);
  }

  create(payload: RoleRequest): Observable<RoleResponse> {
    return this.http.post<RoleResponse>(this.apiUrl, payload);
  }

  update(id: string, payload: RoleRequest): Observable<RoleResponse> {
    return this.http.put<RoleResponse>(`${this.apiUrl}/${id}`, payload);
  }

  assignPermissions(roleId: string, permissionIds: string[]): Observable<RoleResponse> {
    return this.http.post<RoleResponse>(`${this.apiUrl}/${roleId}/permissions`, permissionIds);
  }

  removePermissions(roleId: string, permissionIds: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${roleId}/permissions`, { body: permissionIds });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


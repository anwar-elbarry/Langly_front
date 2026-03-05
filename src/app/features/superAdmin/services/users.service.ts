import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Page } from '../models/page.model';
import { UserRequest, UserResponse, UserUpdateRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/users`;

  getAll(page = 0, size = 10, sort = 'firstName,asc'): Observable<Page<UserResponse>> {
    const params = new HttpParams().set('page', page).set('size', size).set('sort', sort);
    return this.http.get<Page<UserResponse>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  getAllBySchool(schoolId: string): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/school/${schoolId}`);
  }

  getAllByRole(roleName: string): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/role/${roleName}`);
  }

  create(payload: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, payload);
  }

  update(id: string, payload: UserUpdateRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, payload);
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


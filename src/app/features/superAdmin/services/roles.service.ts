import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { RoleResponse } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/roles`;

  getAll(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(this.apiUrl);
  }
}

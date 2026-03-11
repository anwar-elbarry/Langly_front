import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { TeacherOverviewResponse } from '../models/teacher.model';

@Injectable({ providedIn: 'root' })
export class TeacherOverviewService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/teacher`;

  getOverview(): Observable<TeacherOverviewResponse> {
    return this.http.get<TeacherOverviewResponse>(`${this.apiUrl}/overview`);
  }
}

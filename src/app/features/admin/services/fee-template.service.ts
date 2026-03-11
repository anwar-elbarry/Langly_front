import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { FeeTemplateRequest, FeeTemplateResponse } from '../models/billing-engine.model';

@Injectable({ providedIn: 'root' })
export class FeeTemplateService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1`;

  getAll(schoolId: string): Observable<FeeTemplateResponse[]> {
    return this.http.get<FeeTemplateResponse[]>(`${this.baseUrl}/schools/${schoolId}/fee-templates`);
  }

  create(schoolId: string, payload: FeeTemplateRequest): Observable<FeeTemplateResponse> {
    return this.http.post<FeeTemplateResponse>(`${this.baseUrl}/schools/${schoolId}/fee-templates`, payload);
  }

  update(id: string, payload: FeeTemplateRequest): Observable<FeeTemplateResponse> {
    return this.http.put<FeeTemplateResponse>(`${this.baseUrl}/fee-templates/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/fee-templates/${id}`);
  }
}

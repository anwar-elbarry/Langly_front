import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { DiscountRequest, DiscountResponse } from '../models/billing-engine.model';

@Injectable({ providedIn: 'root' })
export class DiscountService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1`;

  getAll(schoolId: string): Observable<DiscountResponse[]> {
    return this.http.get<DiscountResponse[]>(`${this.baseUrl}/schools/${schoolId}/discounts`);
  }

  create(schoolId: string, payload: DiscountRequest): Observable<DiscountResponse> {
    return this.http.post<DiscountResponse>(`${this.baseUrl}/schools/${schoolId}/discounts`, payload);
  }

  update(id: string, payload: DiscountRequest): Observable<DiscountResponse> {
    return this.http.put<DiscountResponse>(`${this.baseUrl}/discounts/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/discounts/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { BillingConfirmRequest, BillingResponse } from '../models/billing.model';

@Injectable({ providedIn: 'root' })
export class BillingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/billings`;

  getAllBySchool(schoolId: string): Observable<BillingResponse[]> {
    return this.http.get<BillingResponse[]>(`${this.apiUrl}/school/${schoolId}`);
  }

  getPending(schoolId: string): Observable<BillingResponse[]> {
    return this.http.get<BillingResponse[]>(`${this.apiUrl}/school/${schoolId}/pending`);
  }

  getAllByStudent(studentId: string): Observable<BillingResponse[]> {
    return this.http.get<BillingResponse[]>(`${this.apiUrl}/student/${studentId}`);
  }

  confirmPayment(id: string, payload: BillingConfirmRequest): Observable<BillingResponse> {
    return this.http.patch<BillingResponse>(`${this.apiUrl}/${id}/confirm`, payload);
  }
}

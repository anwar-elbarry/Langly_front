import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { InvoiceResponse, RecordPaymentRequest, FinancialSummaryResponse } from '../models/billing-engine.model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1`;

  getAllBySchool(schoolId: string): Observable<InvoiceResponse[]> {
    return this.http.get<InvoiceResponse[]>(`${this.baseUrl}/schools/${schoolId}/invoices`);
  }

  getById(id: string): Observable<InvoiceResponse> {
    return this.http.get<InvoiceResponse>(`${this.baseUrl}/invoices/${id}`);
  }

  recordPayment(id: string, payload: RecordPaymentRequest): Observable<InvoiceResponse> {
    return this.http.post<InvoiceResponse>(`${this.baseUrl}/invoices/${id}/payments`, payload);
  }

  getSchedule(id: string): Observable<InvoiceResponse> {
    return this.http.get<InvoiceResponse>(`${this.baseUrl}/invoices/${id}/schedule`);
  }

  createSchedule(id: string, plan: string): Observable<InvoiceResponse> {
    return this.http.post<InvoiceResponse>(`${this.baseUrl}/invoices/${id}/schedule`, { plan });
  }

  getFinancialSummary(schoolId: string): Observable<FinancialSummaryResponse> {
    return this.http.get<FinancialSummaryResponse>(`${this.baseUrl}/schools/${schoolId}/financial-summary`);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { InvoiceResponse } from '../../admin/models/billing-engine.model';

@Injectable({ providedIn: 'root' })
export class StudentInvoiceService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1`;

  getMyInvoices(): Observable<InvoiceResponse[]> {
    return this.http.get<InvoiceResponse[]>(`${this.baseUrl}/students/me/invoices`);
  }

  getById(id: string): Observable<InvoiceResponse> {
    return this.http.get<InvoiceResponse>(`${this.baseUrl}/invoices/${id}`);
  }
}

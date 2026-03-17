import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SubscriptionResponse, PaymentResponse, SelectPaymentMethodRequest } from '../models/subscription.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/subscriptions`;

  getBySchool(schoolId: string): Observable<SubscriptionResponse[]> {
    return this.http.get<SubscriptionResponse[]>(`${this.apiUrl}/school/${schoolId}`);
  }

  pay(id: string, request: SelectPaymentMethodRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/${id}/pay`, request);
  }

  declareTransfer(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/declare-transfer`, {});
  }
}

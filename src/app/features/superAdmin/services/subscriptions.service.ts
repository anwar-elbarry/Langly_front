import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import {
  PaymentStatusUpdateRequest,
  SubscriptionRequest,
  SubscriptionResponse,
  SubscriptionUpdateRequest,
} from '../models/subscription.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/subscriptions`;

  getAll(): Observable<SubscriptionResponse[]> {
    return this.http.get<SubscriptionResponse[]>(this.apiUrl);
  }

  getById(id: string): Observable<SubscriptionResponse> {
    return this.http.get<SubscriptionResponse>(`${this.apiUrl}/${id}`);
  }

  getBySchool(schoolId: string): Observable<SubscriptionResponse[]> {
    return this.http.get<SubscriptionResponse[]>(`${this.apiUrl}/school/${schoolId}`);
  }

  create(payload: SubscriptionRequest): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(this.apiUrl, payload);
  }

  update(id: string, payload: SubscriptionUpdateRequest): Observable<SubscriptionResponse> {
    return this.http.put<SubscriptionResponse>(`${this.apiUrl}/${id}`, payload);
  }

  updatePaymentStatus(id: string, payload: PaymentStatusUpdateRequest): Observable<SubscriptionResponse> {
    return this.http.patch<SubscriptionResponse>(`${this.apiUrl}/${id}/payment-status`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


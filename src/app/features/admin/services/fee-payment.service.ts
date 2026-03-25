import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { FeePaymentRequest, FeePaymentResponse, StudentFeeStatusResponse } from '../models/billing-engine.model';

@Injectable({ providedIn: 'root' })
export class FeePaymentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1/schools`;

  recordPayment(schoolId: string, payload: FeePaymentRequest): Observable<FeePaymentResponse> {
    return this.http.post<FeePaymentResponse>(`${this.baseUrl}/${schoolId}/fee-payments`, payload);
  }

  getStudentFeeStatuses(schoolId: string, studentId: string): Observable<StudentFeeStatusResponse[]> {
    return this.http.get<StudentFeeStatusResponse[]>(`${this.baseUrl}/${schoolId}/fee-payments/student/${studentId}`);
  }

  getPaymentHistory(schoolId: string, studentId: string, feeTemplateId: string): Observable<FeePaymentResponse[]> {
    return this.http.get<FeePaymentResponse[]>(`${this.baseUrl}/${schoolId}/fee-payments/student/${studentId}/fee/${feeTemplateId}`);
  }

  closeRecurringFee(schoolId: string, studentId: string, feeTemplateId: string): Observable<void> {
    const params = new HttpParams()
      .set('studentId', studentId)
      .set('feeTemplateId', feeTemplateId);
    return this.http.put<void>(`${this.baseUrl}/${schoolId}/fee-payments/close`, null, { params });
  }

  deletePayment(schoolId: string, paymentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${schoolId}/fee-payments/${paymentId}`);
  }
}

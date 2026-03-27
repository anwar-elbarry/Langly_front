import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { BillingResponse } from '../../admin/models/billing.model';
import { PaymentResponse } from '../models/student.model';
import { PaymentMethod } from '../../../shared/models/enums';

@Injectable({ providedIn: 'root' })
export class StudentBillingService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/v1/student/billings`;

    getMyBillings(): Observable<BillingResponse[]> {
        return this.http.get<BillingResponse[]>(this.apiUrl);
    }

    selectPaymentMethod(billingId: string, paymentMethod: PaymentMethod): Observable<PaymentResponse> {
        return this.http.post<PaymentResponse>(`${this.apiUrl}/${billingId}/select-method`, { paymentMethod });
    }
}

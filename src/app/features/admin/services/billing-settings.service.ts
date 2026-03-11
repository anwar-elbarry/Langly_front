import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { BillingSettingsRequest, BillingSettingsResponse } from '../models/billing-engine.model';

@Injectable({ providedIn: 'root' })
export class BillingSettingsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/schools`;

  get(schoolId: string): Observable<BillingSettingsResponse> {
    return this.http.get<BillingSettingsResponse>(`${this.apiUrl}/${schoolId}/billing-settings`);
  }

  update(schoolId: string, payload: BillingSettingsRequest): Observable<BillingSettingsResponse> {
    return this.http.put<BillingSettingsResponse>(`${this.apiUrl}/${schoolId}/billing-settings`, payload);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { BankInfoResponse, BankInfoUpdateRequest } from '../models/bank-info.model';

@Injectable({ providedIn: 'root' })
export class BankInfoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/bank-info`;

  get(): Observable<BankInfoResponse> {
    return this.http.get<BankInfoResponse>(this.apiUrl);
  }

  update(payload: BankInfoUpdateRequest): Observable<BankInfoResponse> {
    return this.http.put<BankInfoResponse>(this.apiUrl, payload);
  }
}

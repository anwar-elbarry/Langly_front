import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { StudentFeeCatalogResponse, StudentFeeStatusResponse } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentFeeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/student/fees`;

  getMyFees(): Observable<StudentFeeStatusResponse[]> {
    return this.http.get<StudentFeeStatusResponse[]>(this.apiUrl);
  }

  getCatalog(): Observable<StudentFeeCatalogResponse[]> {
    return this.http.get<StudentFeeCatalogResponse[]>(`${this.apiUrl}/catalog`);
  }
}

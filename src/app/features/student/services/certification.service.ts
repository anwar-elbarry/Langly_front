import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CertificationResponse } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class CertificationService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    /** My certifications */
    getMyCertifications(): Observable<CertificationResponse[]> {
        return this.http.get<CertificationResponse[]>(`${this.apiUrl}/v1/student/certifications`);
    }

    /** Download certification (blob) */
    downloadCertificate(certId: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/v1/student/certifications/${certId}/download`, {
            responseType: 'blob'
        });
    }

    /** Upload certification (Admin) */
    uploadCertificate(file: File, enrollmentId: string): Observable<CertificationResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('enrollmentId', enrollmentId);
        return this.http.post<CertificationResponse>(`${this.apiUrl}/v1/student/certifications/upload`, formData);
    }
}

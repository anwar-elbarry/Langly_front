import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CourseMaterialResponse } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class CourseMaterialService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    /** Course materials list */
    getMaterials(courseId: string): Observable<CourseMaterialResponse[]> {
        return this.http.get<CourseMaterialResponse[]>(`${this.apiUrl}/v1/courses/${courseId}/materials`);
    }

    /** Download course material (blob) */
    downloadMaterial(courseId: string, materialId: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/v1/courses/${courseId}/materials/${materialId}/download`, {
            responseType: 'blob'
        });
    }
}

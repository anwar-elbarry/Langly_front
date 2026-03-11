import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CourseMaterialResponse } from '../models/teacher.model';

@Injectable({ providedIn: 'root' })
export class TeacherMaterialService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/courses`;

  getAll(courseId: string): Observable<CourseMaterialResponse[]> {
    return this.http.get<CourseMaterialResponse[]>(`${this.apiUrl}/${courseId}/materials`);
  }

  upload(courseId: string, file: File, name: string, type: string): Observable<CourseMaterialResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('type', type);
    return this.http.post<CourseMaterialResponse>(`${this.apiUrl}/${courseId}/materials`, formData);
  }

  download(courseId: string, materialId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${courseId}/materials/${materialId}/download`, {
      responseType: 'blob',
    });
  }
}

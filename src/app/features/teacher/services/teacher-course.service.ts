import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CourseResponse } from '../../admin/models/course.model';

@Injectable({ providedIn: 'root' })
export class TeacherCourseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/teacher`;

  getMyCourses(): Observable<CourseResponse[]> {
    return this.http.get<CourseResponse[]>(`${this.apiUrl}/courses`);
  }

  getCourseById(id: string): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(`${environment.apiUrl}/v1/courses/${id}`);
  }
}

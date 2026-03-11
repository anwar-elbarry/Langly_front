import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { CourseResponse } from '../../../admin/models/course.model';
import { levelBadgeClass } from '../../../admin/utils/status.utils';
import { TeacherCourseService } from '../../services/teacher-course.service';

@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent],
  templateUrl: './courses.page.html',
})
export class CoursesPage implements OnInit {
  private router = inject(Router);
  private courseService = inject(TeacherCourseService);

  loading = signal(true);
  courses = signal<CourseResponse[]>([]);

  levelBadgeClass = levelBadgeClass;

  ngOnInit(): void {
    this.courseService
      .getMyCourses()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.courses.set(data),
      });
  }

  openCourse(course: CourseResponse): void {
    this.router.navigate(['/teacher/courses', course.id]);
  }

  capacityPercent(course: CourseResponse): number {
    if (!course.capacity) return 0;
    return Math.min(100, Math.round((course.enrolledCount / course.capacity) * 100));
  }

  isFull(course: CourseResponse): boolean {
    return course.enrolledCount >= course.capacity;
  }
}

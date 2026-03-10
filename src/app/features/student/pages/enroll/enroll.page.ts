import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { StudentCourseService } from '../../services/student-course.service';
import { CourseResponse } from '../../../admin/models/course.model';
import { LEVELS } from '../../../admin/models/enums';
import { Level } from '../../../admin/models/enums';

@Component({
    selector: 'app-enroll',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './enroll.page.html',
})
export class EnrollPage implements OnInit {
    private store = inject(Store);
    private courseService = inject(StudentCourseService);

    user = this.store.selectSignal(selectCurrentUser);
    courses = signal<CourseResponse[]>([]);
    loading = signal(true);
    checkingOut = signal<string | null>(null);
    showLevelModal = signal(false);
    selectedCourse = signal<CourseResponse | null>(null);
    levels = LEVELS;

    ngOnInit(): void {
        const schoolId = this.user()?.schoolId;
        if (schoolId) {
            this.courseService.getAllCourses(schoolId).subscribe({
                next: (data) => {
                    this.courses.set(data.filter(c => c.isActive));
                    this.loading.set(false);
                },
                error: () => this.loading.set(false),
            });
        }
    }

    openLevelModal(course: CourseResponse): void {
        this.selectedCourse.set(course);
        this.showLevelModal.set(true);
    }

    closeLevelModal(): void {
        this.showLevelModal.set(false);
        this.selectedCourse.set(null);
    }

    enrollWithLevel(level: Level): void {
        const course = this.selectedCourse();
        if (!course) return;

        this.checkingOut.set(course.id);
        this.closeLevelModal();

        this.courseService.checkout({ courseId: course.id, level }).subscribe({
            next: (res) => {
                window.location.href = res.checkoutUrl;
            },
            error: () => {
                this.checkingOut.set(null);
                alert('Erreur lors de la création du paiement. Veuillez réessayer.');
            },
        });
    }
}

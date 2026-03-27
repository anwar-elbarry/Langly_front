import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getLanguageFlagUrl } from '../../../../shared/models/enums';
import { StudentCourseService } from '../../services/student-course.service';
import { ActiveCourseResponse } from '../../models/student.model';

@Component({
    selector: 'app-my-courses',
    imports: [RouterLink],
    templateUrl: './my-courses.page.html',
})
export class MyCoursesPage implements OnInit {
    private courseService = inject(StudentCourseService);

    courses = signal<ActiveCourseResponse[]>([]);
    loading = signal(true);
    error = signal('');
    getLanguageFlagUrl = getLanguageFlagUrl;

    ngOnInit(): void {
        this.courseService.getActiveCourses().subscribe({
            next: (data) => {
                this.courses.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.error.set('Impossible de charger vos cours');
                this.loading.set(false);
            },
        });
    }

    getNextSession(course: ActiveCourseResponse): string {
        if (!course.upcomingSessions?.length) return 'Aucune session prévue';
        const next = course.upcomingSessions[0];
        return new Date(next.scheduledAt).toLocaleDateString('fr-FR', {
            weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
        });
    }

    getModeIcon(mode: string): string {
        switch (mode) {
            case 'ONLINE': return 'fa-solid fa-video';
            case 'IN_PERSON': return 'fa-solid fa-building';
            case 'HYBRID': return 'fa-solid fa-arrows-split-up-and-left';
            default: return 'fa-solid fa-circle-question';
        }
    }
}

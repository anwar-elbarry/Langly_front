import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getLanguageFlagUrl } from '../../../admin/models/enums';
import { StudentCourseService } from '../../services/student-course.service';
import { CourseMaterialService } from '../../services/course-material.service';
import { ActiveCourseResponse, CourseMaterialResponse } from '../../models/student.model';

@Component({
    selector: 'app-course-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './course-detail.page.html',
})
export class CourseDetailPage implements OnInit {
    private route = inject(ActivatedRoute);
    private courseService = inject(StudentCourseService);
    private materialService = inject(CourseMaterialService);

    course = signal<ActiveCourseResponse | null>(null);
    materials = signal<CourseMaterialResponse[]>([]);
    loading = signal(true);
    activeTab = signal<'sessions' | 'materials'>('sessions');
    courseId = '';
    getLanguageFlagUrl = getLanguageFlagUrl;

    ngOnInit(): void {
        this.courseId = this.route.snapshot.paramMap.get('id') ?? '';

        this.courseService.getActiveCourses().subscribe({
            next: (courses) => {
                const found = courses.find(c => c.id === this.courseId);
                this.course.set(found ?? null);
                this.loading.set(false);
            },
            error: () => this.loading.set(false),
        });

        this.materialService.getMaterials(this.courseId).subscribe({
            next: (data) => this.materials.set(data),
        });
    }

    setTab(tab: 'sessions' | 'materials'): void {
        this.activeTab.set(tab);
    }

    downloadMaterial(material: CourseMaterialResponse): void {
        this.materialService.downloadMaterial(this.courseId, material.id).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = material.name;
                a.click();
                window.URL.revokeObjectURL(url);
            },
        });
    }

    formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    }

    getModeLabel(mode: string): string {
        switch (mode) {
            case 'ONLINE': return 'En ligne';
            case 'IN_PERSON': return 'Présentiel';
            case 'HYBRID': return 'Hybride';
            default: return mode;
        }
    }

    getTypeIcon(type: string): string {
        switch (type) {
            case 'PDF': return 'fa-solid fa-file-pdf text-red-500';
            case 'VIDEO': return 'fa-solid fa-file-video text-blue-500';
            default: return 'fa-solid fa-file text-gray-500';
        }
    }
}

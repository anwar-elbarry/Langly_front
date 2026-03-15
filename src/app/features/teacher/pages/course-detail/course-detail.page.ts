import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { TableComponent } from '../../../../shared/ui/table/table';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { CourseResponse } from '../../../admin/models/course.model';
import { EnrollmentResponse } from '../../../admin/models/enrollment.model';
import { levelBadgeClass, enrollmentStatusClass, enrollmentStatusLabel } from '../../../admin/utils/status.utils';
import { TeacherCourseService } from '../../services/teacher-course.service';
import { TeacherSessionService } from '../../services/teacher-session.service';
import { TeacherEnrollmentService } from '../../services/teacher-enrollment.service';
import { TeacherMaterialService } from '../../services/teacher-material.service';
import { SessionResponse, SessionRequest, CourseMaterialResponse } from '../../models/teacher.model';

@Component({
  selector: 'app-course-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    SpinnerComponent,
    ButtonComponent,
    TableComponent,
    ModalComponent,
    FormFieldComponent,
    InputComponent,
  ],
  templateUrl: './course-detail.page.html',
})
export class CourseDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private courseService = inject(TeacherCourseService);
  private sessionService = inject(TeacherSessionService);
  private enrollmentService = inject(TeacherEnrollmentService);
  private materialService = inject(TeacherMaterialService);

  // State
  courseId = '';
  activeTab = signal<'overview' | 'sessions' | 'students' | 'resources'>('overview');
  loading = signal(true);
  course = signal<CourseResponse | null>(null);

  // Sessions
  sessions = signal<SessionResponse[]>([]);
  sessionsLoading = signal(false);
  sessionModalOpen = signal(false);
  editingSessionId = signal<string | null>(null);
  savingSession = signal(false);
  confirmDeleteSessionOpen = signal(false);
  deletingSessionId = signal<string | null>(null);

  sessionForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    durationMinutes: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    scheduledAt: new FormControl('', Validators.required),
    mode: new FormControl('IN_PERSON', Validators.required),
    room: new FormControl(''),
    meetingLink: new FormControl(''),
  });

  // Enrollments (students & grades)
  enrollments = signal<EnrollmentResponse[]>([]);
  enrollmentsLoading = signal(false);

  // Materials
  materials = signal<CourseMaterialResponse[]>([]);
  materialsLoading = signal(false);
  uploadModalOpen = signal(false);
  uploading = signal(false);
  selectedFile = signal<File | null>(null);

  uploadForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl('PDF', Validators.required),
  });

  // Utils
  levelBadgeClass = levelBadgeClass;
  enrollmentStatusClass = enrollmentStatusClass;
  enrollmentStatusLabel = enrollmentStatusLabel;

  // Computed: session date constraints from course dates
  sessionMinDate = computed(() => {
    const c = this.course();
    return c?.startDate ? c.startDate + 'T00:00' : '';
  });

  sessionMaxDate = computed(() => {
    const c = this.course();
    return c?.endDate ? c.endDate + 'T23:59' : '';
  });

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];
    this.courseService
      .getCourseById(this.courseId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.course.set(data),
      });
  }

  switchTab(tab: 'overview' | 'sessions' | 'students' | 'resources'): void {
    this.activeTab.set(tab);
    if (tab === 'sessions' && this.sessions().length === 0) this.loadSessions();
    if (tab === 'students' && this.enrollments().length === 0) this.loadEnrollments();
    if (tab === 'resources' && this.materials().length === 0) this.loadMaterials();
  }

  // ── Sessions ──
  loadSessions(): void {
    this.sessionsLoading.set(true);
    this.sessionService
      .getByCourse(this.courseId)
      .pipe(finalize(() => this.sessionsLoading.set(false)))
      .subscribe({ next: (data) => this.sessions.set(data) });
  }

  openCreateSession(): void {
    this.sessionForm.reset({ mode: 'IN_PERSON' });
    this.editingSessionId.set(null);
    this.sessionModalOpen.set(true);
  }

  openEditSession(session: SessionResponse): void {
    this.sessionForm.patchValue({
      title: session.title,
      description: session.description,
      durationMinutes: session.durationMinutes,
      scheduledAt: session.scheduledAt?.slice(0, 16),
      mode: session.mode,
      room: session.room,
      meetingLink: session.meetingLink,
    });
    this.editingSessionId.set(session.id);
    this.sessionModalOpen.set(true);
  }

  closeSessionModal(): void {
    this.sessionModalOpen.set(false);
  }

  saveSession(): void {
    this.sessionForm.markAllAsTouched();
    if (this.sessionForm.invalid) return;

    // Validate session date is within course date range
    const scheduledAt = this.sessionForm.value.scheduledAt || '';
    const c = this.course();
    if (c && scheduledAt) {
      const sessionDate = scheduledAt.slice(0, 10);
      if (c.startDate && sessionDate < c.startDate) {
        this.toast.error(`La session ne peut pas être avant le début du cours (${c.startDate})`);
        return;
      }
      if (c.endDate && sessionDate > c.endDate) {
        this.toast.error(`La session ne peut pas être après la fin du cours (${c.endDate})`);
        return;
      }
    }

    const payload: SessionRequest = {
      title: this.sessionForm.value.title || '',
      description: this.sessionForm.value.description || undefined,
      durationMinutes: this.sessionForm.value.durationMinutes || 60,
      scheduledAt: this.sessionForm.value.scheduledAt || '',
      mode: this.sessionForm.value.mode as SessionRequest['mode'],
      room: this.sessionForm.value.room || undefined,
      meetingLink: this.sessionForm.value.meetingLink || undefined,
      courseId: this.courseId,
    };

    const request$ = this.editingSessionId()
      ? this.sessionService.update(this.editingSessionId()!, payload)
      : this.sessionService.create(payload);

    this.savingSession.set(true);
    request$
      .pipe(finalize(() => this.savingSession.set(false)))
      .subscribe({
        next: () => {
          this.toast.success(`Session ${this.editingSessionId() ? 'modifiée' : 'créée'} avec succès`);
          this.closeSessionModal();
          this.loadSessions();
        },
      });
  }

  openDeleteSession(id: string): void {
    this.deletingSessionId.set(id);
    this.confirmDeleteSessionOpen.set(true);
  }

  closeDeleteSession(): void {
    this.confirmDeleteSessionOpen.set(false);
    this.deletingSessionId.set(null);
  }

  deleteSession(): void {
    const id = this.deletingSessionId();
    if (!id) return;
    this.sessionService.delete(id).subscribe({
      next: () => {
        this.toast.success('Session supprimée');
        this.closeDeleteSession();
        this.loadSessions();
      },
    });
  }

  goToAttendance(sessionId: string): void {
    this.router.navigate(['/teacher/attendance', sessionId]);
  }

  getModeLabel(mode: string): string {
    switch (mode) {
      case 'ONLINE': return 'En ligne';
      case 'IN_PERSON': return 'Présentiel';
      case 'HYBRID': return 'Hybride';
      default: return mode;
    }
  }

  getModeIcon(mode: string): string {
    switch (mode) {
      case 'ONLINE': return 'fa-solid fa-video';
      case 'IN_PERSON': return 'fa-solid fa-building';
      case 'HYBRID': return 'fa-solid fa-arrows-split-up-and-left';
      default: return 'fa-solid fa-circle-question';
    }
  }

  // ── Enrollments ──
  loadEnrollments(): void {
    this.enrollmentsLoading.set(true);
    this.enrollmentService
      .getByCourse(this.courseId)
      .pipe(finalize(() => this.enrollmentsLoading.set(false)))
      .subscribe({ next: (data) => this.enrollments.set(data) });
  }

  updateEnrollmentStatus(enrollment: EnrollmentResponse, status: string): void {
    this.enrollmentService.updateStatus(enrollment.id, status).subscribe({
      next: () => {
        this.toast.success('Statut mis à jour');
        this.loadEnrollments();
      },
    });
  }

  // ── Materials ──
  loadMaterials(): void {
    this.materialsLoading.set(true);
    this.materialService
      .getAll(this.courseId)
      .pipe(finalize(() => this.materialsLoading.set(false)))
      .subscribe({ next: (data) => this.materials.set(data) });
  }

  openUploadModal(): void {
    this.uploadForm.reset({ type: 'PDF' });
    this.selectedFile.set(null);
    this.uploadModalOpen.set(true);
  }

  closeUploadModal(): void {
    this.uploadModalOpen.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile.set(input.files[0]);
    }
  }

  uploadMaterial(): void {
    this.uploadForm.markAllAsTouched();
    const file = this.selectedFile();
    if (this.uploadForm.invalid || !file) return;

    this.uploading.set(true);
    this.materialService
      .upload(this.courseId, file, this.uploadForm.value.name || '', this.uploadForm.value.type || 'PDF')
      .pipe(finalize(() => this.uploading.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Ressource ajoutée');
          this.closeUploadModal();
          this.loadMaterials();
        },
      });
  }

  downloadMaterial(material: CourseMaterialResponse): void {
    this.materialService.download(this.courseId, material.id).subscribe({
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
}

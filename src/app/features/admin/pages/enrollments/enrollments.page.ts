import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { EnrollmentRequest, EnrollmentResponse } from '../../models/enrollment.model';
import { StudentResponse } from '../../models/student.model';
import { CourseResponse } from '../../models/course.model';
import { EnrollmentStatus } from '../../models/enums';
import { EnrollmentService } from '../../services/enrollment.service';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/course.service';
import { enrollmentStatusClass, enrollmentStatusLabel, levelBadgeClass } from '../../utils/status.utils';

type StatusFilter = 'ALL' | EnrollmentStatus;

@Component({
  selector: 'app-enrollments-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    PaginationComponent,
    ButtonComponent,
    ModalComponent,
    FormFieldComponent,
    SpinnerComponent,
  ],
  templateUrl: './enrollments.page.html',
})
export class EnrollmentsPage implements OnInit {
  private store = inject(Store);
  private enrollmentService = inject(EnrollmentService);
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);
  private toast = inject(ToastService);

  user = this.store.selectSignal(selectCurrentUser);
  loading = signal(false);
  saving = signal(false);
  enrollments = signal<EnrollmentResponse[]>([]);
  students = signal<StudentResponse[]>([]);
  courses = signal<CourseResponse[]>([]);
  modalOpen = signal(false);
  activeTab = signal<StatusFilter>('ALL');
  currentPage = signal(0);
  pageSize = signal(10);

  enrollmentStatusClass = enrollmentStatusClass;
  enrollmentStatusLabel = enrollmentStatusLabel;
  levelBadgeClass = levelBadgeClass;

  statusChangeId = signal<string | null>(null);

  statusOptions: EnrollmentStatus[] = [
    'PENDING_APPROVAL',
    'APPROVED',
    'REJECTED',
    'IN_PROGRESS',
    'PASSED',
    'FAILED',
    'WITHDRAWN',
    'TRANSFERRED',
  ];

  tabs: { label: string; value: StatusFilter }[] = [
    { label: 'Tous', value: 'ALL' },
    { label: 'En attente', value: 'PENDING_APPROVAL' },
    { label: 'Approuvé', value: 'APPROVED' },
    { label: 'En cours', value: 'IN_PROGRESS' },
    { label: 'Réussi', value: 'PASSED' },
    { label: 'Échoué', value: 'FAILED' },
    { label: 'Rejeté', value: 'REJECTED' },
  ];

  pendingCount = computed(() => this.enrollments().filter(e => e.status === 'PENDING_APPROVAL').length);
  approvedCount = computed(() => this.enrollments().filter(e => e.status === 'APPROVED').length);
  inProgressCount = computed(() => this.enrollments().filter(e => e.status === 'IN_PROGRESS').length);
  passedCount = computed(() => this.enrollments().filter(e => e.status === 'PASSED').length);
  failedCount = computed(() => this.enrollments().filter(e => e.status === 'FAILED').length);
  rejectedCount = computed(() => this.enrollments().filter(e => e.status === 'REJECTED').length);
  totalCount = computed(() => this.enrollments().length);

  filteredEnrollments = computed(() => {
    const tab = this.activeTab();
    const all = this.enrollments();
    if (tab === 'ALL') return all;
    return all.filter((e) => e.status === tab);
  });

  totalItems = computed(() => this.filteredEnrollments().length);

  paginatedEnrollments = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.filteredEnrollments().slice(start, start + this.pageSize());
  });

  form = new FormGroup({
    studentId: new FormControl('', Validators.required),
    courseId: new FormControl('', Validators.required),
  });

  selectedCourse = computed(() => {
    const id = this.form.controls.courseId.value;
    return this.courses().find((c) => c.id === id) || null;
  });

  isCourseFull = computed(() => {
    const course = this.selectedCourse();
    return course ? course.enrolledCount >= course.capacity : false;
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;
    this.loading.set(true);
    this.enrollmentService
      .getAllBySchool(schoolId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (data) => this.enrollments.set(data) });

    this.studentService.getAllBySchool(schoolId).subscribe({
      next: (data) => this.students.set(data),
    });
    this.courseService.getAllBySchool(schoolId).subscribe({
      next: (data) => this.courses.set(data),
    });
  }

  setTab(tab: StatusFilter): void {
    this.activeTab.set(tab);
    this.currentPage.set(0);
  }

  onPageChange(page: number) { this.currentPage.set(page); }
  onPageSizeChange(size: number) { this.pageSize.set(size); this.currentPage.set(0); }

  openCreate(): void {
    this.form.reset();
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  approveEnrollment(id: string): void {
    this.statusChangeId.set(id);
    this.enrollmentService.approveEnrollment(id)
      .pipe(finalize(() => this.statusChangeId.set(null)))
      .subscribe({
        next: () => {
          this.toast.success('Inscription approuvée. Facturation créée.');
          this.loadData();
        },
        error: () => this.toast.error('Erreur lors de l\'approbation.'),
      });
  }

  rejectEnrollment(id: string): void {
    this.statusChangeId.set(id);
    this.enrollmentService.rejectEnrollment(id)
      .pipe(finalize(() => this.statusChangeId.set(null)))
      .subscribe({
        next: () => {
          this.toast.success('Inscription rejetée.');
          this.loadData();
        },
        error: () => this.toast.error('Erreur lors du rejet.'),
      });
  }

  changeEnrollmentStatus(enrollment: EnrollmentResponse, target: EnrollmentStatus | string): void {
    const nextStatus = target as EnrollmentStatus;
    if (nextStatus === enrollment.status) return;
    const confirmed = confirm(
      `Changer le statut de ${enrollment.studentFullName} en ${this.enrollmentStatusLabel(nextStatus)} ?`,
    );
    if (!confirmed) return;

    this.statusChangeId.set(enrollment.id);

    let request$;
    if (nextStatus === 'APPROVED') {
      request$ = this.enrollmentService.approveEnrollment(enrollment.id);
    } else if (nextStatus === 'REJECTED') {
      request$ = this.enrollmentService.rejectEnrollment(enrollment.id);
    } else {
      request$ = this.enrollmentService.updateStatus(enrollment.id, nextStatus);
    }

    request$
      .pipe(finalize(() => this.statusChangeId.set(null)))
      .subscribe({
        next: () => {
          this.toast.success('Statut mis Ã  jour');
          this.loadData();
        },
        error: () => this.toast.error('Erreur lors de la mise Ã  jour du statut'),
      });
  }

  saveEnrollment(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const payload: EnrollmentRequest = {
      studentId: this.form.value.studentId || '',
      courseId: this.form.value.courseId || '',
    };

    this.saving.set(true);
    this.enrollmentService
      .enroll(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (enrollment) => {
          this.toast.success(`${enrollment.studentFullName} inscrit(e) au cours ${enrollment.courseName}`);
          this.closeModal();
          this.loadData();
        },
      });
  }
}

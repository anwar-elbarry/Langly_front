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
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { EnrollmentRequest, EnrollmentResponse } from '../../models/enrollment.model';
import { StudentResponse } from '../../models/student.model';
import { CourseResponse } from '../../models/course.model';
import { LEVELS, EnrollmentStatus } from '../../models/enums';
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

  levels = LEVELS;
  enrollmentStatusClass = enrollmentStatusClass;
  enrollmentStatusLabel = enrollmentStatusLabel;
  levelBadgeClass = levelBadgeClass;

  approvingId = signal<string | null>(null);
  rejectingId = signal<string | null>(null);

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

  filteredEnrollments = computed(() => {
    const tab = this.activeTab();
    const all = this.enrollments();
    if (tab === 'ALL') return all;
    return all.filter((e) => e.status === tab);
  });

  form = new FormGroup({
    studentId: new FormControl('', Validators.required),
    courseId: new FormControl('', Validators.required),
    level: new FormControl('', Validators.required),
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
  }

  openCreate(): void {
    this.form.reset();
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  approveEnrollment(id: string): void {
    this.approvingId.set(id);
    this.enrollmentService.approveEnrollment(id)
      .pipe(finalize(() => this.approvingId.set(null)))
      .subscribe({
        next: () => {
          this.toast.success('Inscription approuvée. Facturation créée.');
          this.loadData();
        },
        error: () => this.toast.error('Erreur lors de l\'approbation.'),
      });
  }

  rejectEnrollment(id: string): void {
    this.rejectingId.set(id);
    this.enrollmentService.rejectEnrollment(id)
      .pipe(finalize(() => this.rejectingId.set(null)))
      .subscribe({
        next: () => {
          this.toast.success('Inscription rejetée.');
          this.loadData();
        },
        error: () => this.toast.error('Erreur lors du rejet.'),
      });
  }

  saveEnrollment(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const payload: EnrollmentRequest = {
      studentId: this.form.value.studentId || '',
      courseId: this.form.value.courseId || '',
      level: this.form.value.level as any,
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

import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination';
import { SearchFilterBarComponent, FilterConfig } from '../../../../shared/ui/search-filter-bar/search-filter-bar';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { SearchSelectComponent, Option } from '../../../../shared/ui/search-select/search-select';
import { UserResponse } from '../../../auth/models/User.response';
import { CourseRequest, CourseResponse } from '../../models/course.model';
import { getLanguageFlagUrl, LANGUAGES, LEVELS } from '../../models/enums';
import { CourseService } from '../../services/course.service';
import { SchoolUserService } from '../../services/school-user.service';
import { levelBadgeClass } from '../../utils/status.utils';

@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    ModalComponent,
    FormFieldComponent,
    InputComponent,
    SpinnerComponent,
    PaginationComponent,
    SearchFilterBarComponent,
    SearchSelectComponent,
  ],
  templateUrl: './courses.page.html',
})
export class CoursesPage implements OnInit {
  private store = inject(Store);
  private courseService = inject(CourseService);
  private userService = inject(SchoolUserService);
  private toast = inject(ToastService);

  user = this.store.selectSignal(selectCurrentUser);
  loading = signal(false);
  saving = signal(false);
  courses = signal<CourseResponse[]>([]);
  teachers = signal<UserResponse[]>([]);
  modalOpen = signal(false);
  confirmDeleteOpen = signal(false);
  editingCourseId = signal<string | null>(null);
  deletingCourseId = signal<string | null>(null);

  // Filter & pagination state
  searchQuery = signal('');
  languageFilter = signal('');
  levelFilter = signal('');
  currentPage = signal(0);
  pageSize = signal(12);

  levels = LEVELS;
  languages = LANGUAGES;
  levelBadgeClass = levelBadgeClass;
  getLanguageFlagUrl = getLanguageFlagUrl;

  filterConfigs: FilterConfig[] = [
    { key: 'language', label: 'Toutes les langues', options: LANGUAGES.map(l => ({ value: l.value, label: l.label })) },
    { key: 'level', label: 'Tous les niveaux', options: LEVELS.map(l => ({ value: l, label: l })) },
  ];

  filteredCourses = computed(() => {
    let result = this.courses();
    const q = this.searchQuery().toLowerCase();
    if (q) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      );
    }
    const lang = this.languageFilter();
    if (lang) result = result.filter(c => c.language === lang);
    const level = this.levelFilter();
    if (level) result = result.filter(c => c.requiredLevel === level || c.targetLevel === level);
    return result;
  });

  totalItems = computed(() => this.filteredCourses().length);

  paginatedCourses = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.filteredCourses().slice(start, start + this.pageSize());
  });

  teacherOptions = computed<Option[]>(() =>
    this.teachers().map((t) => ({ id: t.id, label: `${t.firstName ?? ''} ${t.lastName ?? ''}`.trim() }))
  );

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
    language: new FormControl('', Validators.required),
    requiredLevel: new FormControl('', Validators.required),
    targetLevel: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    capacity: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    sessionPerWeek: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    minutesPerSession: new FormControl<number | null>(null),
    teacherId: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.loadCourses();
    this.loadTeachers();
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(0);
  }

  onFilterChange(event: { key: string; value: string }) {
    if (event.key === 'language') this.languageFilter.set(event.value);
    if (event.key === 'level') this.levelFilter.set(event.value);
    this.currentPage.set(0);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(0);
  }

  loadCourses(): void {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;
    this.loading.set(true);
    this.courseService
      .getAllBySchool(schoolId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (data) => this.courses.set(data) });
  }

  loadTeachers(): void {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;
    this.userService.getTeachersBySchool(schoolId).subscribe({
      next: (data) => this.teachers.set(data),
    });
  }

  openCreate(): void {
    this.form.reset();
    this.editingCourseId.set(null);
    this.modalOpen.set(true);
  }

  openEdit(course: CourseResponse): void {
    this.form.patchValue({
      name: course.name,
      code: course.code,
      language: course.language,
      requiredLevel: course.requiredLevel,
      targetLevel: course.targetLevel,
      startDate: course.startDate,
      endDate: course.endDate,
      price: course.price,
      capacity: course.capacity,
      sessionPerWeek: course.sessionPerWeek,
      minutesPerSession: course.minutesPerSession,
      teacherId: course.teacherId,
    });
    this.editingCourseId.set(course.id);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  saveCourse(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;

    const payload: CourseRequest = {
      name: this.form.value.name || '',
      code: this.form.value.code || '',
      language: this.form.value.language || '',
      requiredLevel: this.form.value.requiredLevel as any,
      targetLevel: this.form.value.targetLevel as any,
      startDate: this.form.value.startDate || '',
      endDate: this.form.value.endDate || '',
      price: this.form.value.price || 0,
      capacity: this.form.value.capacity || 0,
      sessionPerWeek: this.form.value.sessionPerWeek || 0,
      minutesPerSession: this.form.value.minutesPerSession || undefined,
      teacherId: this.form.value.teacherId || '',
      schoolId,
    };

    const request$ = this.editingCourseId()
      ? this.courseService.update(this.editingCourseId()!, payload)
      : this.courseService.create(payload);

    this.saving.set(true);
    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success(`Cours ${this.editingCourseId() ? 'modifié' : 'créé'} avec succès`);
          this.closeModal();
          this.loadCourses();
        },
      });
  }

  openDelete(id: string): void {
    this.deletingCourseId.set(id);
    this.confirmDeleteOpen.set(true);
  }

  closeDelete(): void {
    this.confirmDeleteOpen.set(false);
    this.deletingCourseId.set(null);
  }

  deleteCourse(): void {
    const id = this.deletingCourseId();
    if (!id) return;
    this.courseService.delete(id).subscribe({
      next: () => {
        this.toast.success('Cours supprimé');
        this.closeDelete();
        this.loadCourses();
      },
    });
  }

  capacityPercent(course: CourseResponse): number {
    if (!course.capacity) return 0;
    return Math.min(100, Math.round((course.enrolledCount / course.capacity) * 100));
  }

  isFull(course: CourseResponse): boolean {
    return course.enrolledCount >= course.capacity;
  }
}

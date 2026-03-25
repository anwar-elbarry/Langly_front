import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { StudentResponse } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { levelBadgeClass } from '../../utils/status.utils';

type ProfileFilter = 'ALL' | 'COMPLETE' | 'INCOMPLETE';

@Component({
  selector: 'app-students-page',
  standalone: true,
  imports: [CommonModule, TableComponent, SpinnerComponent, PaginationComponent],
  templateUrl: './students.page.html',
})
export class StudentsPage implements OnInit {
  private store = inject(Store);
  private studentService = inject(StudentService);
  private router = inject(Router);

  user = this.store.selectSignal(selectCurrentUser);
  loading = signal(false);
  students = signal<StudentResponse[]>([]);
  levelFilter = signal<string>('');
  profileFilter = signal<ProfileFilter>('ALL');
  searchQuery = signal('');
  currentPage = signal(0);
  pageSize = signal(10);

  levelBadgeClass = levelBadgeClass;

  filteredStudents = computed(() => {
    let result = this.students();
    const level = this.levelFilter();
    const profile = this.profileFilter();
    const q = this.searchQuery().toLowerCase();

    if (q) {
      result = result.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }
    if (level) {
      result = result.filter((s) => s.level === level);
    }
    if (profile === 'COMPLETE') {
      result = result.filter((s) => !s.missingFields || s.missingFields.length === 0);
    } else if (profile === 'INCOMPLETE') {
      result = result.filter((s) => s.missingFields && s.missingFields.length > 0);
    }
    return result;
  });

  totalItems = computed(() => this.filteredStudents().length);

  paginatedStudents = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.filteredStudents().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;
    this.loading.set(true);
    this.studentService
      .getAllBySchool(schoolId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (data) => this.students.set(data) });
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.currentPage.set(0);
  }

  setLevelFilter(level: string): void {
    this.levelFilter.set(level);
    this.currentPage.set(0);
  }

  setProfileFilter(filter: ProfileFilter): void {
    this.profileFilter.set(filter);
    this.currentPage.set(0);
  }

  onPageChange(page: number) { this.currentPage.set(page); }
  onPageSizeChange(size: number) { this.pageSize.set(size); this.currentPage.set(0); }

  viewStudent(id: string): void {
    this.router.navigate(['/schoolAdmin/students', id]);
  }

  isProfileComplete(student: StudentResponse): boolean {
    return !student.missingFields || student.missingFields.length === 0;
  }
}

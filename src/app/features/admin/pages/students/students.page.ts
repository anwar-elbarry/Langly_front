import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { StudentResponse } from '../../models/student.model';
import { Level } from '../../models/enums';
import { StudentService } from '../../services/student.service';
import { levelBadgeClass } from '../../utils/status.utils';

type ProfileFilter = 'ALL' | 'COMPLETE' | 'INCOMPLETE';

@Component({
  selector: 'app-students-page',
  standalone: true,
  imports: [CommonModule, TableComponent, SpinnerComponent],
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

  levelBadgeClass = levelBadgeClass;

  filteredStudents = computed(() => {
    let result = this.students();
    const level = this.levelFilter();
    const profile = this.profileFilter();

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

  setLevelFilter(level: string): void {
    this.levelFilter.set(level);
  }

  setProfileFilter(filter: ProfileFilter): void {
    this.profileFilter.set(filter);
  }

  viewStudent(id: string): void {
    this.router.navigate(['/schoolAdmin/students', id]);
  }

  isProfileComplete(student: StudentResponse): boolean {
    return !student.missingFields || student.missingFields.length === 0;
  }
}

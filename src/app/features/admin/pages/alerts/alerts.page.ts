import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { finalize, forkJoin } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { StudentResponse } from '../../models/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [CommonModule, TableComponent, SpinnerComponent],
  templateUrl: './alerts.page.html',
})
export class AlertsPage implements OnInit {
  private store = inject(Store);
  private studentService = inject(StudentService);
  private router = inject(Router);

  user = this.store.selectSignal(selectCurrentUser);
  loading = signal(true);
  incompleteStudents = signal<StudentResponse[]>([]);
  totalStudents = signal(0);

  ngOnInit(): void {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;

    forkJoin({
      all: this.studentService.getAllBySchool(schoolId),
      incomplete: this.studentService.getIncomplete(schoolId),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ all, incomplete }) => {
          this.totalStudents.set(all.length);
          this.incompleteStudents.set(incomplete);
        },
      });
  }

  viewStudent(id: string): void {
    this.router.navigate(['/schoolAdmin/students', id]);
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { finalize, forkJoin } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { SchoolOverviewService, SchoolOverview } from '../../services/school-overview.service';
import { StudentService } from '../../services/student.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { BillingService } from '../../services/billing.service';
import { StudentResponse } from '../../models/student.model';
import { EnrollmentResponse } from '../../models/enrollment.model';
import { BillingResponse } from '../../models/billing.model';
import { Level, LEVELS } from '../../models/enums';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, SpinnerComponent, ButtonComponent],
  templateUrl: './home.page.html',
})
export class HomePage implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private overviewService = inject(SchoolOverviewService);
  private studentService = inject(StudentService);
  private enrollmentService = inject(EnrollmentService);
  private billingService = inject(BillingService);

  user = this.store.selectSignal(selectCurrentUser);
  loading = signal(true);
  overview = signal<SchoolOverview | null>(null);

  // Chart data
  studentsByLevelChart = signal<ChartConfiguration<'bar'>['data'] | null>(null);
  enrollmentStatusChart = signal<ChartConfiguration<'doughnut'>['data'] | null>(null);
  billingStatusChart = signal<ChartConfiguration<'doughnut'>['data'] | null>(null);

  barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  ngOnInit(): void {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;

    forkJoin({
      overview: this.overviewService.getOverview(schoolId),
      students: this.studentService.getAllBySchool(schoolId),
      enrollments: this.enrollmentService.getAllBySchool(schoolId),
      billings: this.billingService.getAllBySchool(schoolId),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ overview, students, enrollments, billings }) => {
          this.overview.set(overview);
          this.buildStudentsByLevelChart(students);
          this.buildEnrollmentStatusChart(enrollments);
          this.buildBillingStatusChart(billings);
        },
      });
  }

  private buildStudentsByLevelChart(students: StudentResponse[]): void {
    const counts = LEVELS.map(
      (level) => students.filter((s) => s.level === level).length
    );
    this.studentsByLevelChart.set({
      labels: [...LEVELS],
      datasets: [
        {
          data: counts,
          backgroundColor: ['#86EFAC', '#22C55E', '#FBBF24', '#F59E0B', '#3B82F6', '#1D4ED8'],
          borderRadius: 6,
        },
      ],
    });
  }

  private buildEnrollmentStatusChart(enrollments: EnrollmentResponse[]): void {
    const statuses = ['IN_PROGRESS', 'PASSED', 'FAILED', 'WITHDRAWN', 'TRANSFERRED'] as const;
    const labels = ['En cours', 'Réussi', 'Échoué', 'Retiré', 'Transféré'];
    const counts = statuses.map(
      (s) => enrollments.filter((e) => e.status === s).length
    );
    this.enrollmentStatusChart.set({
      labels,
      datasets: [
        {
          data: counts,
          backgroundColor: ['#F59E0B', '#22C55E', '#EF4444', '#6B7280', '#3B82F6'],
        },
      ],
    });
  }

  private buildBillingStatusChart(billings: BillingResponse[]): void {
    const statuses = ['PAID', 'PENDING', 'OVERDUE', 'CANCELLED'] as const;
    const labels = ['Payé', 'En attente', 'En retard', 'Annulé'];
    const counts = statuses.map(
      (s) => billings.filter((b) => b.status === s).length
    );
    this.billingStatusChart.set({
      labels,
      datasets: [
        {
          data: counts,
          backgroundColor: ['#22C55E', '#F59E0B', '#EF4444', '#6B7280'],
        },
      ],
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}

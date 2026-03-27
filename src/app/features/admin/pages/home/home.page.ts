import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { finalize, forkJoin } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { DecimalPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { SchoolOverviewService, SchoolOverview } from '../../services/school-overview.service';
import { StudentService } from '../../services/student.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { BillingService } from '../../services/billing.service';
import { InvoiceService } from '../../services/invoice.service';
import { StudentResponse } from '../../models/student.model';
import { EnrollmentResponse } from '../../models/enrollment.model';
import { BillingResponse } from '../../models/billing.model';
import { FinancialSummaryResponse } from '../../models/billing-engine.model';
import { Level, LEVELS } from '../../../../shared/models/enums';

@Component({
  selector: 'app-home-page',
  imports: [DecimalPipe, BaseChartDirective, SpinnerComponent, ButtonComponent],
  templateUrl: './home.page.html',
})
export class HomePage implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private overviewService = inject(SchoolOverviewService);
  private studentService = inject(StudentService);
  private enrollmentService = inject(EnrollmentService);
  private billingService = inject(BillingService);
  private invoiceService = inject(InvoiceService);

  user = this.store.selectSignal(selectCurrentUser);
  loading = signal(true);
  overview = signal<SchoolOverview | null>(null);
  financialSummary = signal<FinancialSummaryResponse | null>(null);
  earningsView = signal<'before_tva' | 'after_tva'>('before_tva');

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
      financialSummary: this.invoiceService.getFinancialSummary(schoolId),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ overview, students, enrollments, billings, financialSummary }) => {
          this.overview.set(overview);
          this.financialSummary.set(financialSummary);
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
    const statuses = ['PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS', 'PASSED', 'FAILED', 'REJECTED', 'WITHDRAWN', 'TRANSFERRED'] as const;
    const labels = ['En attente', 'Approuvé', 'En cours', 'Réussi', 'Échoué', 'Rejeté', 'Retiré', 'Transféré'];
    const counts = statuses.map(
      (s) => enrollments.filter((e) => e.status === s).length
    );
    this.enrollmentStatusChart.set({
      labels,
      datasets: [
        {
          data: counts,
          backgroundColor: ['#F97316', '#3B82F6', '#F59E0B', '#22C55E', '#EF4444', '#DC2626', '#6B7280', '#0EA5E9'],
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

  setEarningsView(view: 'before_tva' | 'after_tva'): void {
    this.earningsView.set(view);
  }

  displayedPaidRevenue(): number {
    const fs = this.financialSummary();
    if (!fs) return 0;
    return this.earningsView() === 'after_tva'
      ? Number(fs.paidRevenue) - Number(fs.paidTva)
      : Number(fs.paidRevenue);
  }

  displayedTotalRevenue(): number {
    const fs = this.financialSummary();
    if (!fs) return 0;
    return this.earningsView() === 'after_tva'
      ? Number(fs.totalRevenue) - Number(fs.totalTva)
      : Number(fs.totalRevenue);
  }

  displayedPendingRevenue(): number {
    const fs = this.financialSummary();
    if (!fs) return 0;
    return this.earningsView() === 'after_tva'
      ? Number(fs.pendingRevenue) - Number(fs.pendingTva)
      : Number(fs.pendingRevenue);
  }
}

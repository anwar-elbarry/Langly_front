import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { finalize, forkJoin } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { DecimalPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
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
  imports: [DecimalPipe, BaseChartDirective, SpinnerComponent],
  templateUrl: './home.page.html',
  styles: [`
    .banner-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border: 0;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color .15s ease, transform .15s ease;
    }
    .banner-btn:active { transform: translateY(1px); }
  `],
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

  readonly today = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  /** Main figures, each opening the matching page. */
  kpis = computed(() => {
    const o = this.overview();
    return [
      { label: 'Professeurs', value: o?.teacherCount ?? 0, icon: 'fa-solid fa-chalkboard-user', tile: 'bg-blue-50 text-blue-600', route: '/schoolAdmin/team' },
      { label: 'Étudiants', value: o?.studentCount ?? 0, icon: 'fa-solid fa-user-graduate', tile: 'bg-emerald-50 text-emerald-600', route: '/schoolAdmin/students' },
      { label: 'Cours actifs', value: o?.activeCourseCount ?? 0, icon: 'fa-solid fa-book-open', tile: 'bg-sky-50 text-sky-600', route: '/schoolAdmin/courses' },
      { label: 'Inscriptions en cours', value: o?.activeEnrollmentCount ?? 0, icon: 'fa-solid fa-clipboard-list', tile: 'bg-amber-50 text-amber-600', route: '/schoolAdmin/enrollments' },
    ];
  });

  /** Items that need an action from the director. */
  attention = computed(() => {
    const o = this.overview();
    return [
      { label: 'Demandes d\'inscription', hint: 'À approuver ou refuser', value: o?.pendingEnrollmentCount ?? 0, icon: 'fa-solid fa-hourglass-half', tile: 'bg-orange-50 text-orange-600', badge: 'bg-orange-100 text-orange-700', route: '/schoolAdmin/enrollments' },
      { label: 'Paiements en attente', hint: 'Échéances non réglées', value: o?.pendingBillingCount ?? 0, icon: 'fa-solid fa-clock', tile: 'bg-amber-50 text-amber-600', badge: 'bg-amber-100 text-amber-700', route: '/schoolAdmin/billings' },
      { label: 'Profils incomplets', hint: 'Informations élève manquantes', value: o?.incompleteProfileCount ?? 0, icon: 'fa-solid fa-triangle-exclamation', tile: 'bg-red-50 text-red-600', badge: 'bg-red-100 text-red-700', route: '/schoolAdmin/alerts' },
    ];
  });

  attentionCount = computed(() => this.attention().reduce((sum, item) => sum + item.value, 0));

  /** Share of the invoiced amount already collected, in %. */
  paidShare(): number {
    const total = this.displayedTotalRevenue();
    return total > 0 ? Math.min(100, (this.displayedPaidRevenue() / total) * 100) : 0;
  }

  // Chart data
  studentsByLevelChart = signal<ChartConfiguration<'bar'>['data'] | null>(null);
  enrollmentStatusChart = signal<ChartConfiguration<'doughnut'>['data'] | null>(null);
  billingStatusChart = signal<ChartConfiguration<'doughnut'>['data'] | null>(null);

  barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, border: { display: false }, ticks: { color: '#667085', font: { family: 'Inter', weight: 600 } } },
      y: { beginAtZero: true, border: { display: false }, grid: { color: '#f1f3f6' }, ticks: { color: '#98a2b3', precision: 0, font: { family: 'Inter' } } },
    },
  };

  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, padding: 14, color: '#475467', font: { family: 'Inter', size: 12 } },
      },
    },
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
          backgroundColor: ['#c7cbfe', '#a4a8fc', '#8183f8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3'],
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 36,
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
          backgroundColor: ['#f59e0b', '#6366f1', '#4f46e5', '#12a150', '#e5484d', '#f97066', '#98a2b3', '#8b5cf6'],
          borderWidth: 0,
          hoverOffset: 6,
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
          backgroundColor: ['#12a150', '#f59e0b', '#e5484d', '#98a2b3'],
          borderWidth: 0,
          hoverOffset: 6,
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

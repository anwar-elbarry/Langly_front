import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { TableComponent } from '../../../../shared/ui/table/table';
import { OverviewData, OverviewService } from '../../services/overview.service';
import { paymentStatusClass } from '../../utils/status.utils';

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [CommonModule, TableComponent, ButtonComponent],
  templateUrl: './overview.page.html',
})
export class OverviewPage implements OnInit {
  private overviewService = inject(OverviewService);

  loading = signal(false);
  earningsView = signal<'before_tva' | 'after_tva'>('before_tva');
  data = signal<OverviewData>({
    totalSchools: 0,
    totalUsers: 0,
    activeSubscriptions: 0,
    overdueSubscriptions: 0,
    paidRevenueBeforeTva: 0,
    paidRevenueAfterTva: 0,
    paidTvaAmount: 0,
    recentSubscriptions: [],
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.overviewService.getOverviewData().subscribe({
      next: (overview) => this.data.set(overview),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  setEarningsView(view: 'before_tva' | 'after_tva'): void {
    this.earningsView.set(view);
  }

  displayedRevenue(): number {
    const snapshot = this.data();
    return this.earningsView() === 'after_tva'
      ? snapshot.paidRevenueAfterTva
      : snapshot.paidRevenueBeforeTva;
  }

  get averageTvaRate(): number {
    const snapshot = this.data();
    if (snapshot.paidRevenueBeforeTva === 0) {
      return 0;
    }
    return (snapshot.paidTvaAmount / snapshot.paidRevenueBeforeTva) * 100;
  }

  paymentStatusClass = paymentStatusClass;
}

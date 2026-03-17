import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { TableComponent } from '../../../../shared/ui/table/table';
import { OverviewData, OverviewService } from '../../services/overview.service';
import { paymentStatusClass } from '../../utils/status.utils';

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [CommonModule, TableComponent, ButtonComponent, SpinnerComponent],
  templateUrl: './overview.page.html',
})
export class OverviewPage implements OnInit {
  private overviewService = inject(OverviewService);
  private router = inject(Router);

  loading = signal(false);
  data = signal<OverviewData>({
    totalSchools: 0,
    totalUsers: 0,
    activeSubscriptions: 0,
    overdueSubscriptions: 0,
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

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  paymentStatusClass = paymentStatusClass;
}

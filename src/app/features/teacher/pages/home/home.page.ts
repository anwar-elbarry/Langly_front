import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { TeacherOverviewService } from '../../services/teacher-overview.service';
import { TeacherOverviewResponse } from '../../models/teacher.model';

@Component({
  selector: 'app-home-page',
  imports: [SpinnerComponent, ButtonComponent],
  templateUrl: './home.page.html',
})
export class HomePage implements OnInit {
  private router = inject(Router);
  private overviewService = inject(TeacherOverviewService);

  loading = signal(true);
  overview = signal<TeacherOverviewResponse | null>(null);

  ngOnInit(): void {
    this.overviewService
      .getOverview()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.overview.set(data),
      });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}

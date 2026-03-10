import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { StudentResponse } from '../../models/student.model';
import { EnrollmentResponse } from '../../models/enrollment.model';
import { BillingResponse } from '../../models/billing.model';
import { StudentService } from '../../services/student.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { BillingService } from '../../services/billing.service';
import { enrollmentStatusClass, enrollmentStatusLabel, levelBadgeClass, paymentStatusClass, paymentStatusLabel } from '../../utils/status.utils';

type Tab = 'enrollments' | 'billings';

@Component({
  selector: 'app-student-detail-page',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent],
  templateUrl: './student-detail.page.html',
})
export class StudentDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private enrollmentService = inject(EnrollmentService);
  private billingService = inject(BillingService);

  loading = signal(true);
  student = signal<StudentResponse | null>(null);
  enrollments = signal<EnrollmentResponse[]>([]);
  billings = signal<BillingResponse[]>([]);
  activeTab = signal<Tab>('enrollments');

  levelBadgeClass = levelBadgeClass;
  enrollmentStatusClass = enrollmentStatusClass;
  enrollmentStatusLabel = enrollmentStatusLabel;
  paymentStatusClass = paymentStatusClass;
  paymentStatusLabel = paymentStatusLabel;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    forkJoin({
      student: this.studentService.getById(id),
      enrollments: this.enrollmentService.getAllByStudent(id),
      billings: this.billingService.getAllByStudent(id),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ student, enrollments, billings }) => {
          this.student.set(student);
          this.enrollments.set(enrollments);
          this.billings.set(billings);
        },
      });
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  goBack(): void {
    this.router.navigate(['/schoolAdmin/students']);
  }

  hasMissingFields(): boolean {
    const s = this.student();
    return !!s && !!s.missingFields && s.missingFields.length > 0;
  }
}

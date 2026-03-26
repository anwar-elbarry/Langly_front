import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { InvoiceResponse } from '../../../admin/models/billing-engine.model';
import { StudentInvoiceService } from '../../services/student-invoice.service';
import { invoiceStatusClass, invoiceStatusLabel, scheduleStatusClass, scheduleStatusLabel } from '../../../admin/utils/status.utils';

@Component({
  selector: 'app-student-invoice-detail-page',
  standalone: true,
  imports: [CommonModule, TableComponent, ButtonComponent, SpinnerComponent],
  templateUrl: './invoice-detail.page.html',
})
export class StudentInvoiceDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private invoiceService = inject(StudentInvoiceService);

  loading = signal(true);
  invoice = signal<InvoiceResponse | null>(null);

  invoiceStatusClass = invoiceStatusClass;
  invoiceStatusLabel = invoiceStatusLabel;
  scheduleStatusClass = scheduleStatusClass;
  scheduleStatusLabel = scheduleStatusLabel;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.invoiceService
      .getById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.invoice.set(data),
        error: () => this.router.navigate(['/student/invoices']),
      });
  }

  goBack(): void {
    this.router.navigate(['/student/invoices']);
  }

  paidAmount(): number {
    const inv = this.invoice();
    if (!inv?.schedules?.length) return 0;
    return inv.schedules
      .filter((s) => s.status === 'PAID')
      .reduce((sum, s) => sum + s.amount, 0);
  }

  remainingAmount(): number {
    const inv = this.invoice();
    if (!inv) return 0;
    return inv.total - this.paidAmount();
  }
}

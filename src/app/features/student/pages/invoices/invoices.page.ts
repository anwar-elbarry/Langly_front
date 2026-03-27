import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { InvoiceResponse } from '../../../admin/models/billing-engine.model';
import { StudentInvoiceService } from '../../services/student-invoice.service';
import { invoiceStatusClass, invoiceStatusLabel } from '../../../admin/utils/status.utils';

@Component({
  selector: 'app-student-invoices-page',
  imports: [DatePipe, DecimalPipe, TableComponent, SpinnerComponent],
  templateUrl: './invoices.page.html',
})
export class StudentInvoicesPage implements OnInit {
  private invoiceService = inject(StudentInvoiceService);
  private router = inject(Router);

  loading = signal(true);
  invoices = signal<InvoiceResponse[]>([]);

  invoiceStatusClass = invoiceStatusClass;
  invoiceStatusLabel = invoiceStatusLabel;

  ngOnInit(): void {
    this.invoiceService
      .getMyInvoices()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (data) => this.invoices.set(data) });
  }

  viewDetail(invoice: InvoiceResponse): void {
    this.router.navigate(['/student/invoices', invoice.id]);
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { StudentBillingService } from '../../services/student-billing.service';
import { BillingResponse } from '../../../admin/models/billing.model';
import { PaymentMethod } from '../../../admin/models/enums';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { paymentStatusClass, paymentStatusLabel } from '../../../admin/utils/status.utils';

@Component({
  selector: 'app-student-billings',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent],
  templateUrl: './billings.page.html',
})
export class BillingsPage implements OnInit {
  private billingService = inject(StudentBillingService);

  loading = signal(true);
  billings = signal<BillingResponse[]>([]);
  expandedBillingId = signal<string | null>(null);

  paymentStatusClass = paymentStatusClass;
  paymentStatusLabel = paymentStatusLabel;

  ngOnInit(): void {
    this.billingService
      .getMyBillings()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (data) => this.billings.set(data) });
  }

  toggleExpand(billingId: string): void {
    this.expandedBillingId.update((current) =>
      current === billingId ? null : billingId
    );
  }

  paymentMethodLabel(method: PaymentMethod | string): string {
    switch (method) {
      case 'CASH':
        return 'Espèces';
      case 'BANK_TRANSFER':
        return 'Virement bancaire';
      case 'ONLINE_GATEWAY':
      case 'STRIPE':
        return 'Paiement en ligne';
      default:
        return method || '—';
    }
  }
}

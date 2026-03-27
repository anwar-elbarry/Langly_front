import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { InvoiceResponse } from '../../models/billing-engine.model';
import { InvoiceService } from '../../services/invoice.service';
import { invoiceStatusClass, invoiceStatusLabel, scheduleStatusClass, scheduleStatusLabel } from '../../utils/status.utils';

@Component({
  selector: 'app-invoice-detail-page',
  imports: [
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    FormFieldComponent,
    InputComponent,
    SpinnerComponent,
  ],
  templateUrl: './invoice-detail.page.html',
})
export class InvoiceDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private invoiceService = inject(InvoiceService);
  private toast = inject(ToastService);

  loading = signal(true);
  recording = signal(false);
  invoice = signal<InvoiceResponse | null>(null);
  paymentModalOpen = signal(false);

  invoiceStatusClass = invoiceStatusClass;
  invoiceStatusLabel = invoiceStatusLabel;
  scheduleStatusClass = scheduleStatusClass;
  scheduleStatusLabel = scheduleStatusLabel;

  paymentForm = new FormGroup({
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    paymentMethod: new FormControl<string>('CASH', Validators.required),
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.invoiceService
      .getById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.invoice.set(data),
        error: () => this.router.navigate(['/schoolAdmin/invoices']),
      });
  }

  goBack(): void {
    this.router.navigate(['/schoolAdmin/invoices']);
  }

  openPaymentModal(): void {
    const inv = this.invoice();
    if (!inv) return;
    this.paymentForm.reset({ paymentMethod: 'CASH', amount: inv.total - this.paidAmount() });
    this.paymentModalOpen.set(true);
  }

  closePaymentModal(): void {
    this.paymentModalOpen.set(false);
  }

  recordPayment(): void {
    this.paymentForm.markAllAsTouched();
    if (this.paymentForm.invalid) return;

    const inv = this.invoice();
    if (!inv) return;

    this.recording.set(true);
    this.invoiceService
      .recordPayment(inv.id, {
        amount: this.paymentForm.value.amount!,
        paymentMethod: this.paymentForm.value.paymentMethod || 'CASH',
      })
      .pipe(finalize(() => this.recording.set(false)))
      .subscribe({
        next: (updated) => {
          this.invoice.set(updated);
          this.toast.success('Paiement enregistré');
          this.closePaymentModal();
        },
        error: () => this.toast.error('Erreur lors de l\'enregistrement du paiement'),
      });
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

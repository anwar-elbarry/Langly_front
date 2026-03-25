import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { RadioComponent } from '../../../../shared/ui/radio/radio';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { BillingConfirmRequest, BillingResponse } from '../../models/billing.model';
import { BillingService } from '../../services/billing.service';
import { paymentStatusClass, paymentStatusLabel } from '../../utils/status.utils';

type BillingTab = 'PENDING' | 'ALL';

@Component({
  selector: 'app-billings-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    PaginationComponent,
    ButtonComponent,
    ModalComponent,
    FormFieldComponent,
    RadioComponent,
    SpinnerComponent,
  ],
  templateUrl: './billings.page.html',
})
export class BillingsPage implements OnInit {
  private store = inject(Store);
  private billingService = inject(BillingService);
  private toast = inject(ToastService);

  user = this.store.selectSignal(selectCurrentUser);
  loading = signal(false);
  saving = signal(false);
  billings = signal<BillingResponse[]>([]);
  activeTab = signal<BillingTab>('PENDING');
  confirmModalOpen = signal(false);
  confirmingBilling = signal<BillingResponse | null>(null);
  searchQuery = signal('');
  currentPage = signal(0);
  pageSize = signal(10);

  paymentStatusClass = paymentStatusClass;
  paymentStatusLabel = paymentStatusLabel;

  expandedBillingId = signal<string | null>(null);

  form = new FormGroup({
    paymentMethod: new FormControl<'CASH' | 'BANK_TRANSFER'>('CASH', Validators.required),
  });

  filteredBillings = computed(() => {
    let result = this.billings();
    const q = this.searchQuery().toLowerCase();
    if (q) {
      result = result.filter(b => b.studentFullName.toLowerCase().includes(q));
    }
    return result;
  });

  totalItems = computed(() => this.filteredBillings().length);

  paginatedBillings = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.filteredBillings().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadBillings();
  }

  loadBillings(): void {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;
    this.loading.set(true);

    const request$ =
      this.activeTab() === 'PENDING'
        ? this.billingService.getPending(schoolId)
        : this.billingService.getAllBySchool(schoolId);

    request$
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (data) => this.billings.set(data) });
  }

  setTab(tab: BillingTab): void {
    this.activeTab.set(tab);
    this.currentPage.set(0);
    this.loadBillings();
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.currentPage.set(0);
  }

  onPageChange(page: number) { this.currentPage.set(page); }
  onPageSizeChange(size: number) { this.pageSize.set(size); this.currentPage.set(0); }

  openConfirm(billing: BillingResponse): void {
    this.confirmingBilling.set(billing);
    this.form.reset({ paymentMethod: 'CASH' });
    this.confirmModalOpen.set(true);
  }

  closeConfirm(): void {
    this.confirmModalOpen.set(false);
    this.confirmingBilling.set(null);
  }

  toggleExpand(billingId: string): void {
    this.expandedBillingId.update((current) =>
      current === billingId ? null : billingId
    );
  }

  paymentMethodLabel(method: string): string {
    switch (method) {
      case 'CASH': return 'Espèces';
      case 'BANK_TRANSFER': return 'Virement bancaire';
      case 'ONLINE_GATEWAY':
      case 'STRIPE': return 'Paiement en ligne';
      default: return method || '—';
    }
  }

  confirmPayment(): void {
    const billing = this.confirmingBilling();
    if (!billing) return;

    const payload: BillingConfirmRequest = {
      paymentMethod: this.form.value.paymentMethod || 'CASH',
    };

    this.saving.set(true);
    this.billingService
      .confirmPayment(billing.id, payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          const methodLabel = payload.paymentMethod === 'CASH' ? 'Espèces' : 'Virement bancaire';
          this.toast.success(`Paiement de ${billing.price} DH confirmé pour ${billing.studentFullName} (${methodLabel})`);
          this.closeConfirm();
          this.loadBillings();
        },
      });
  }
}

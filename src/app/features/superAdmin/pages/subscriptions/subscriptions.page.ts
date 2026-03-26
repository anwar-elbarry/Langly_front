import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { TableComponent } from '../../../../shared/ui/table/table';
import { SearchSelectComponent, Option } from '../../../../shared/ui/search-select/search-select';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { SearchFilterBarComponent, FilterConfig } from '../../../../shared/ui/search-filter-bar/search-filter-bar';
import { SchoolResponse } from '../../models/school.model';
import {
  BillingCycle,
  PaymentStatus,
  SubscriptionRequest,
  SubscriptionResponse,
  SubscriptionUpdateRequest,
} from '../../models/subscription.model';
import { BankInfoResponse } from '../../models/bank-info.model';
import { BankInfoService } from '../../services/bank-info.service';
import { SchoolsService } from '../../services/schools.service';
import { SubscriptionsService } from '../../services/subscriptions.service';
import { paymentStatusClass } from '../../utils/status.utils';

@Component({
  selector: 'app-subscriptions-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    FormFieldComponent,
    InputComponent,
    SpinnerComponent,
    SearchFilterBarComponent,
    SearchSelectComponent,
  ],
  templateUrl: './subscriptions.page.html',
})
export class SubscriptionsPage implements OnInit {
  private subscriptionsService = inject(SubscriptionsService);
  private schoolsService = inject(SchoolsService);
  private bankInfoService = inject(BankInfoService);
  private toast = inject(ToastService);

  loading = signal(false);
  saving = signal(false);
  subscriptions = signal<SubscriptionResponse[]>([]);
  schools = signal<SchoolResponse[]>([]);
  statusFilter = signal('');
  schoolFilter = signal('');
  searchQuery = signal('');

  modalOpen = signal(false);
  editingId = signal<string | null>(null);
  editingStatus = signal<string | null>(null);
  deleteOpen = signal(false);
  deletingId = signal<string | null>(null);
  paymentModalOpen = signal(false);
  paymentTarget = signal<SubscriptionResponse | null>(null);
  paymentStatus = signal<PaymentStatus>('PENDING');
  bankInfo = signal<BankInfoResponse | null>(null);
  bankInfoSaving = signal(false);

  filteredSubscriptions = computed(() =>
    this.subscriptions().filter((item) => {
      if (this.statusFilter() && item.status !== this.statusFilter()) return false;
      if (this.schoolFilter() && item.schoolId !== this.schoolFilter()) return false;
      const q = this.searchQuery().trim().toLowerCase();
      if (q) {
        const schoolName = this.schoolNameById(item.schoolId).toLowerCase();
        if (!schoolName.includes(q)) return false;
      }
      return true;
    })
  );

  filterConfigs = computed<FilterConfig[]>(() => [
    {
      key: 'status',
      label: 'Tous les statuts',
      options: [
        { value: 'PAID', label: 'PAID' },
        { value: 'PENDING', label: 'PENDING' },
        { value: 'OVERDUE', label: 'OVERDUE' },
        { value: 'CANCELLED', label: 'CANCELLED' },
      ],
    },
    {
      key: 'school',
      label: 'Toutes les écoles',
      options: this.schools().map((s) => ({ value: s.id, label: s.name })),
    },
  ]);

  schoolOptions = computed<Option[]>(() => {
    const subscribedSchoolIds = new Set(this.subscriptions().map((sub) => sub.schoolId));
    return this.schools()
      .filter((school) => !subscribedSchoolIds.has(school.id))
      .map((s) => ({ id: s.id, label: s.name }));
  });

  form = new FormGroup({
    schoolId: new FormControl('', Validators.required),
    amount: new FormControl<number | null>(null, Validators.required),
    billingCycle: new FormControl<BillingCycle>('MONTHLY', Validators.required),
  });

  bankForm = new FormGroup({
    bankName: new FormControl('', Validators.required),
    accountHolder: new FormControl('', Validators.required),
    iban: new FormControl('', Validators.required),
    motive: new FormControl('', Validators.required),
    note: new FormControl(''),
  });

  ngOnInit(): void {
    this.loadSchools();
    this.loadSubscriptions();
    this.loadBankInfo();
  }

  loadSchools(): void {
    this.schoolsService.getAll().subscribe({
      next: (schools) => this.schools.set(schools),
    });
  }

  loadSubscriptions(): void {
    this.loading.set(true);
    this.subscriptionsService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.subscriptions.set(data),
      });
  }

  loadBankInfo(): void {
    this.bankInfoService.get().subscribe({
      next: (info) => {
        this.bankInfo.set(info);
        this.bankForm.patchValue({
          bankName: info.bankName,
          accountHolder: info.accountHolder,
          iban: info.iban,
          motive: info.motive,
          note: info.note || '',
        });
      },
    });
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onFilterChange(event: { key: string; value: string }): void {
    if (event.key === 'status') this.statusFilter.set(event.value);
    if (event.key === 'school') this.schoolFilter.set(event.value);
  }

  openCreate(): void {
    this.editingId.set(null);
    this.editingStatus.set(null);
    this.form.reset({
      schoolId: '',
      amount: null,
      billingCycle: 'MONTHLY',
    });
    this.form.controls.schoolId.setValidators([Validators.required]);
    this.form.controls.schoolId.updateValueAndValidity();
    this.modalOpen.set(true);
  }

  openEdit(item: SubscriptionResponse): void {
    this.editingId.set(item.id);
    this.editingStatus.set(item.status || null);
    this.form.patchValue({
      schoolId: item.schoolId,
      amount: item.amount,
      billingCycle: item.billingCycle as BillingCycle,
    });
    this.form.controls.schoolId.clearValidators();
    this.form.controls.schoolId.updateValueAndValidity();
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const id = this.editingId();
    const request$ = id ? this.updateSubscription(id) : this.createSubscription();
    if (!request$) return;

    this.saving.set(true);
    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success(`Subscription ${id ? 'updated' : 'created'} successfully`);
          this.closeModal();
          this.loadSubscriptions();
        },
      });
  }

  saveBankInfo(): void {
    this.bankForm.markAllAsTouched();
    if (this.bankForm.invalid) return;
    const payload = {
      bankName: this.bankForm.value.bankName || '',
      accountHolder: this.bankForm.value.accountHolder || '',
      iban: this.bankForm.value.iban || '',
      motive: this.bankForm.value.motive || '',
      note: this.bankForm.value.note || '',
    };
    this.bankInfoSaving.set(true);
    this.bankInfoService
      .update(payload)
      .pipe(finalize(() => this.bankInfoSaving.set(false)))
      .subscribe({
        next: (info) => {
          this.bankInfo.set(info);
          this.toast.success('Informations bancaires mises à jour');
        },
      });
  }

  createSubscription() {
    const payload: SubscriptionRequest = {
      schoolId: this.form.value.schoolId || '',
      amount: Number(this.form.value.amount || 0),
      currency: 'MAD',
      billingCycle: (this.form.value.billingCycle || 'MONTHLY') as BillingCycle,
    };
    return this.subscriptionsService.create(payload);
  }

  updateSubscription(id: string) {
    const payload: SubscriptionUpdateRequest = {
      amount: Number(this.form.value.amount || 0),
      currency: 'MAD',
      billingCycle: (this.form.value.billingCycle || 'MONTHLY') as BillingCycle,
    };
    return this.subscriptionsService.update(id, payload);
  }

  openDelete(id: string): void {
    this.deletingId.set(id);
    this.deleteOpen.set(true);
  }

  closeDelete(): void {
    this.deletingId.set(null);
    this.deleteOpen.set(false);
  }

  deleteSubscription(): void {
    const id = this.deletingId();
    if (!id) return;
    this.subscriptionsService.delete(id).subscribe({
      next: () => {
        this.toast.success('Subscription deleted');
        this.closeDelete();
        this.loadSubscriptions();
      },
    });
  }

  openPaymentModal(item: SubscriptionResponse): void {
    this.paymentTarget.set(item);
    this.paymentStatus.set((item.status || 'PENDING') as PaymentStatus);
    this.paymentModalOpen.set(true);
  }

  closePaymentModal(): void {
    this.paymentTarget.set(null);
    this.paymentModalOpen.set(false);
  }

  savePaymentStatus(): void {
    const item = this.paymentTarget();
    if (!item) return;
    this.subscriptionsService.updatePaymentStatus(item.id, { status: this.paymentStatus() }).subscribe({
      next: () => {
        this.toast.success('Payment status updated');
        this.closePaymentModal();
        this.loadSubscriptions();
      },
    });
  }

  validateTransfer(id: string): void {
    this.subscriptionsService.updatePaymentStatus(id, { status: 'PAID' }).subscribe({
      next: () => {
        this.toast.success('Transfer validated and subscription activated');
        this.loadSubscriptions();
      },
    });
  }

  schoolNameById(id: string): string {
    return this.schools().find((school) => school.id === id)?.name || id;
  }

  schoolLogoById(id: string): string | null {
    return this.schools().find((school) => school.id === id)?.logo || null;
  }

  paymentStatusClass = paymentStatusClass;
}

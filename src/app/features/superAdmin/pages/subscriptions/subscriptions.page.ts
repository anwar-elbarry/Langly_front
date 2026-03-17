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
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { SchoolResponse } from '../../models/school.model';
import {
  BillingCycle,
  PaymentStatus,
  SubscriptionRequest,
  SubscriptionResponse,
  SubscriptionUpdateRequest,
} from '../../models/subscription.model';
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
  ],
  templateUrl: './subscriptions.page.html',
})
export class SubscriptionsPage implements OnInit {
  private subscriptionsService = inject(SubscriptionsService);
  private schoolsService = inject(SchoolsService);
  private toast = inject(ToastService);

  loading = signal(false);
  saving = signal(false);
  subscriptions = signal<SubscriptionResponse[]>([]);
  schools = signal<SchoolResponse[]>([]);
  statusFilter = signal('');
  schoolFilter = signal('');

  modalOpen = signal(false);
  editingId = signal<string | null>(null);
  deleteOpen = signal(false);
  deletingId = signal<string | null>(null);
  paymentModalOpen = signal(false);
  paymentTarget = signal<SubscriptionResponse | null>(null);
  paymentStatus = signal<PaymentStatus>('PENDING');

  filteredSubscriptions = computed(() =>
    this.subscriptions().filter((item) => {
      if (this.statusFilter() && item.status !== this.statusFilter()) return false;
      if (this.schoolFilter() && item.schoolId !== this.schoolFilter()) return false;
      return true;
    })
  );

  schoolSearchTerm = signal('');

  filteredAvailableSchools = computed(() => {
    const term = this.schoolSearchTerm().toLowerCase().trim();
    // Get list of school IDs that already have a subscription
    const subscribedSchoolIds = new Set(this.subscriptions().map((sub) => sub.schoolId));

    return this.schools().filter((school) => {
      if (subscribedSchoolIds.has(school.id)) return false;
      if (term && !school.name.toLowerCase().includes(term)) return false;
      return true;
    });
  });

  form = new FormGroup({
    schoolId: new FormControl('', Validators.required),
    amount: new FormControl<number | null>(null, Validators.required),
    currency: new FormControl('MAD', Validators.required),
    billingCycle: new FormControl<BillingCycle>('MONTHLY', Validators.required),
  });

  ngOnInit(): void {
    this.loadSchools();
    this.loadSubscriptions();
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

  openCreate(): void {
    this.editingId.set(null);
    this.schoolSearchTerm.set('');
    this.form.reset({
      schoolId: '',
      amount: null,
      currency: 'MAD',
      billingCycle: 'MONTHLY',
    });
    this.form.controls.schoolId.setValidators([Validators.required]);
    this.form.controls.schoolId.updateValueAndValidity();
    this.modalOpen.set(true);
  }

  openEdit(item: SubscriptionResponse): void {
    this.editingId.set(item.id);
    this.form.patchValue({
      schoolId: item.schoolId,
      amount: item.amount,
      currency: item.currency,
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

  createSubscription() {
    const payload: SubscriptionRequest = {
      schoolId: this.form.value.schoolId || '',
      amount: Number(this.form.value.amount || 0),
      currency: this.form.value.currency || 'MAD',
      billingCycle: (this.form.value.billingCycle || 'MONTHLY') as BillingCycle,
    };
    return this.subscriptionsService.create(payload);
  }

  updateSubscription(id: string) {
    const payload: SubscriptionUpdateRequest = {
      amount: Number(this.form.value.amount || 0),
      currency: this.form.value.currency || 'MAD',
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

  paymentStatusClass = paymentStatusClass;
}

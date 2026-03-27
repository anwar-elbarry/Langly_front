import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { DiscountRequest, DiscountResponse } from '../../models/billing-engine.model';
import { DISCOUNT_TYPES, DiscountType } from '../../models/enums';
import { DiscountService } from '../../services/discount.service';
import { discountTypeLabel } from '../../utils/status.utils';

@Component({
  selector: 'app-discounts-page',
  imports: [
    ReactiveFormsModule,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    FormFieldComponent,
    InputComponent,
    SpinnerComponent,
  ],
  templateUrl: './discounts.page.html',
})
export class DiscountsPage implements OnInit {
  private store = inject(Store);
  private discountService = inject(DiscountService);
  private toast = inject(ToastService);

  user = this.store.selectSignal(selectCurrentUser);
  loading = signal(true);
  saving = signal(false);
  discounts = signal<DiscountResponse[]>([]);
  modalOpen = signal(false);
  confirmDeleteOpen = signal(false);
  editingId = signal<string | null>(null);
  deletingId = signal<string | null>(null);

  discountTypes = DISCOUNT_TYPES;
  discountTypeLabel = discountTypeLabel;

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl<DiscountType>('PERCENTAGE', Validators.required),
    value: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    isActive: new FormControl<boolean>(true),
  });

  ngOnInit(): void {
    this.loadDiscounts();
  }

  loadDiscounts(): void {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;
    this.loading.set(true);
    this.discountService
      .getAll(schoolId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (data) => this.discounts.set(data) });
  }

  openCreate(): void {
    this.form.reset({ type: 'PERCENTAGE', isActive: true });
    this.editingId.set(null);
    this.modalOpen.set(true);
  }

  openEdit(discount: DiscountResponse): void {
    this.form.patchValue({
      name: discount.name,
      type: discount.type,
      value: discount.value,
      isActive: discount.isActive,
    });
    this.editingId.set(discount.id);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  saveDiscount(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;

    const payload: DiscountRequest = {
      name: this.form.value.name || '',
      type: this.form.value.type || 'PERCENTAGE',
      value: this.form.value.value || 0,
      isActive: this.form.value.isActive ?? true,
    };

    const request$ = this.editingId()
      ? this.discountService.update(this.editingId()!, payload)
      : this.discountService.create(schoolId, payload);

    this.saving.set(true);
    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success(`Remise ${this.editingId() ? 'modifiée' : 'créée'} avec succès`);
          this.closeModal();
          this.loadDiscounts();
        },
        error: () => this.toast.error('Une erreur est survenue'),
      });
  }

  openDelete(id: string): void {
    this.deletingId.set(id);
    this.confirmDeleteOpen.set(true);
  }

  closeDelete(): void {
    this.confirmDeleteOpen.set(false);
    this.deletingId.set(null);
  }

  deleteDiscount(): void {
    const id = this.deletingId();
    if (!id) return;
    this.discountService.delete(id).subscribe({
      next: () => {
        this.toast.success('Remise supprimée');
        this.closeDelete();
        this.loadDiscounts();
      },
      error: () => this.toast.error('Erreur lors de la suppression'),
    });
  }

  formatValue(discount: DiscountResponse): string {
    return discount.type === 'PERCENTAGE'
      ? `${discount.value}%`
      : `${discount.value} DH`;
  }
}

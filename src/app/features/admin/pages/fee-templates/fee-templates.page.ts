import { CommonModule } from '@angular/common';
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
import { FeeTemplateRequest, FeeTemplateResponse } from '../../models/billing-engine.model';
import { FEE_TYPES, FeeType } from '../../models/enums';
import { FeeTemplateService } from '../../services/fee-template.service';
import { BillingSettingsService } from '../../services/billing-settings.service';
import { feeTypeLabel } from '../../utils/status.utils';

@Component({
  selector: 'app-fee-templates-page',
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
  templateUrl: './fee-templates.page.html',
})
export class FeeTemplatesPage implements OnInit {
  private store = inject(Store);
  private feeTemplateService = inject(FeeTemplateService);
  private settingsService = inject(BillingSettingsService);
  private toast = inject(ToastService);

  user = this.store.selectSignal(selectCurrentUser);
  loading = signal(true);
  saving = signal(false);
  feeTemplates = signal<FeeTemplateResponse[]>([]);
  currency = signal('MAD');
  modalOpen = signal(false);
  confirmDeleteOpen = signal(false);
  editingId = signal<string | null>(null);
  deletingId = signal<string | null>(null);

  feeTypes = FEE_TYPES;
  feeTypeLabel = feeTypeLabel;

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl<FeeType>('TUITION', Validators.required),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    isRecurring: new FormControl<boolean>(false),
    isActive: new FormControl<boolean>(true),
  });

  ngOnInit(): void {
    this.loadFeeTemplates();
  }

  loadFeeTemplates(): void {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;
    this.loading.set(true);

    this.settingsService.get(schoolId).subscribe({
      next: (settings) => this.currency.set(settings.currency || 'MAD')
    });

    this.feeTemplateService
      .getAll(schoolId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (data) => this.feeTemplates.set(data) });
  }

  openCreate(): void {
    this.form.reset({ type: 'TUITION', isRecurring: false, isActive: true });
    this.editingId.set(null);
    this.modalOpen.set(true);
  }

  openEdit(fee: FeeTemplateResponse): void {
    this.form.patchValue({
      name: fee.name,
      type: fee.type,
      amount: fee.amount,
      isRecurring: fee.isRecurring,
      isActive: fee.isActive,
    });
    this.editingId.set(fee.id);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  saveFeeTemplate(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;

    const payload: FeeTemplateRequest = {
      name: this.form.value.name || '',
      type: this.form.value.type || 'TUITION',
      amount: this.form.value.amount || 0,
      isRecurring: this.form.value.isRecurring ?? false,
      isActive: this.form.value.isActive ?? true,
    };

    const request$ = this.editingId()
      ? this.feeTemplateService.update(this.editingId()!, payload)
      : this.feeTemplateService.create(schoolId, payload);

    this.saving.set(true);
    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success(`Frais ${this.editingId() ? 'modifié' : 'créé'} avec succès`);
          this.closeModal();
          this.loadFeeTemplates();
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

  deleteFeeTemplate(): void {
    const id = this.deletingId();
    if (!id) return;
    this.feeTemplateService.delete(id).subscribe({
      next: () => {
        this.toast.success('Frais supprimé');
        this.closeDelete();
        this.loadFeeTemplates();
      },
      error: () => this.toast.error('Erreur lors de la suppression'),
    });
  }
}

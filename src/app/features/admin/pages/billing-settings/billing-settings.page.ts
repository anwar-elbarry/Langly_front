import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { BillingSettingsRequest, BillingSettingsResponse } from '../../models/billing-engine.model';
import { INSTALLMENT_PLANS, InstallmentPlan } from '../../models/enums';
import { BillingSettingsService } from '../../services/billing-settings.service';

@Component({
  selector: 'app-billing-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FormFieldComponent,
    InputComponent,
    SpinnerComponent,
  ],
  templateUrl: './billing-settings.page.html',
})
export class BillingSettingsPage implements OnInit {
  private store = inject(Store);
  private settingsService = inject(BillingSettingsService);
  private toast = inject(ToastService);

  user = this.store.selectSignal(selectCurrentUser);
  loading = signal(true);
  saving = signal(false);
  installmentPlans = INSTALLMENT_PLANS;

  form = new FormGroup({
    tvaRate: new FormControl<number>(20, [Validators.required, Validators.min(0), Validators.max(100)]),
    dueDateDays: new FormControl<number>(0, [Validators.required]),
    defaultInstallmentPlan: new FormControl<InstallmentPlan>('FULL', [Validators.required]),
    blockOnUnpaid: new FormControl<boolean>(false),
    discountEnabled: new FormControl<boolean>(false),
  });

  ngOnInit(): void {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;

    this.settingsService
      .get(schoolId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (settings) => this.patchForm(settings),
        error: () => this.loading.set(false),
      });
  }

  private patchForm(settings: BillingSettingsResponse): void {
    this.form.patchValue({
      tvaRate: settings.tvaRate,
      dueDateDays: settings.dueDateDays,
      defaultInstallmentPlan: settings.defaultInstallmentPlan,
      blockOnUnpaid: settings.blockOnUnpaid,
      discountEnabled: settings.discountEnabled,
    });
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;

    const payload: BillingSettingsRequest = {
      tvaRate: this.form.value.tvaRate ?? 20,
      dueDateDays: this.form.value.dueDateDays ?? 0,
      defaultInstallmentPlan: this.form.value.defaultInstallmentPlan ?? 'FULL',
      blockOnUnpaid: this.form.value.blockOnUnpaid ?? false,
      discountEnabled: this.form.value.discountEnabled ?? false,
    };

    this.saving.set(true);
    this.settingsService
      .update(schoolId, payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.toast.success('Paramètres de facturation mis à jour'),
        error: () => this.toast.error('Erreur lors de la mise à jour'),
      });
  }
}

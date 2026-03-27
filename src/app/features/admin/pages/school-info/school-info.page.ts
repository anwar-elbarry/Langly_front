import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Store } from '@ngrx/store';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { SchoolService } from '../../services/school.service';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { SchoolResponse } from '../../../superAdmin/models/school.model';

@Component({
  selector: 'app-school-info-page',
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './school-info.page.html',
})
export class SchoolInfoPage implements OnInit {
  private schoolService = inject(SchoolService);
  private store = inject(Store);
  private toast = inject(ToastService);

  user = this.store.selectSignal(selectCurrentUser);

  school = signal<SchoolResponse | null>(null);
  loading = signal(true);
  saving = signal(false);
  savingLogo = signal(false);

  logoUrl = new FormControl('');

  infoForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    city: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    address: new FormControl(''),
  });

  ngOnInit(): void {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;

    this.schoolService.getById(schoolId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => {
          this.school.set(data);
          this.infoForm.patchValue({
            name: data.name ?? '',
            city: data.city ?? '',
            country: data.country ?? '',
            address: data.address ?? '',
          });
        },
        error: () => this.toast.error('Impossible de charger les informations de l\'école'),
      });
  }

  onLogoFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;

    this.savingLogo.set(true);
    this.schoolService.uploadLogo(schoolId, file)
      .pipe(finalize(() => this.savingLogo.set(false)))
      .subscribe({
        next: (updated) => {
          this.school.set(updated);
          this.toast.success('Logo mis à jour avec succès');
        },
        error: () => this.toast.error('Échec de l\'upload du logo'),
      });
  }

  applyLogoUrl(): void {
    const url = this.logoUrl.value?.trim();
    if (!url) return;

    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;

    this.savingLogo.set(true);
    this.schoolService.update(schoolId, { logo: url })
      .pipe(finalize(() => this.savingLogo.set(false)))
      .subscribe({
        next: (updated) => {
          this.school.set(updated);
          this.logoUrl.reset();
          this.toast.success('Logo mis à jour avec succès');
        },
        error: () => this.toast.error('Échec de la mise à jour du logo'),
      });
  }

  saveInfo(): void {
    this.infoForm.markAllAsTouched();
    if (this.infoForm.invalid) return;

    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;

    this.saving.set(true);
    this.schoolService.update(schoolId, {
      name: this.infoForm.value.name ?? undefined,
      city: this.infoForm.value.city ?? undefined,
      country: this.infoForm.value.country ?? undefined,
      address: this.infoForm.value.address ?? undefined,
    })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (updated) => {
          this.school.set(updated);
          this.toast.success('Informations mises à jour avec succès');
        },
        error: () => this.toast.error('Échec de la mise à jour'),
      });
  }
}

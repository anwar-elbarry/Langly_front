import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { UsersService } from '../../../superAdmin/services/users.service';
import { StudentProfileService } from '../../services/student-profile.service';
import { StudentProfileResponse } from '../../models/student-profile.model';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';

@Component({
  selector: 'app-student-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    InputComponent,
    ButtonComponent,
    SpinnerComponent,
  ],
  templateUrl: './student-settings.page.html',
})
export class StudentSettingsPage implements OnInit {
  private usersService = inject(UsersService);
  private studentProfileService = inject(StudentProfileService);
  private store = inject(Store);
  private toast = inject(ToastService);

  user = this.store.selectSignal(selectCurrentUser);
  studentProfile = signal<StudentProfileResponse | null>(null);
  loading = signal(true);
  savingProfile = signal(false);
  savingPassword = signal(false);

  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl(''),
    cnie: new FormControl(''),
    birthDate: new FormControl(''),
  });

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.studentProfileService.getMyProfile()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (profile) => {
          this.studentProfile.set(profile);
          this.profileForm.patchValue({
            firstName: profile.firstName ?? '',
            lastName: profile.lastName ?? '',
            email: profile.email ?? '',
            phoneNumber: profile.phoneNumber ?? '',
            cnie: profile.cnie ?? '',
            birthDate: profile.birthDate ?? '',
          });
        },
      });
  }

  get passwordMismatch(): boolean {
    const { newPassword, confirmPassword } = this.passwordForm.value;
    return !!newPassword && !!confirmPassword && newPassword !== confirmPassword;
  }

  get genderLabel(): string {
    const profile = this.studentProfile();
    if (!profile?.gender) return '—';
    return profile.gender === 'MALE' ? 'Homme' : 'Femme';
  }

  saveProfile(): void {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid) return;

    const current = this.user();
    if (!current) return;

    this.savingProfile.set(true);

    const userUpdate$ = this.usersService.update(current.id, {
      firstName: this.profileForm.value.firstName ?? undefined,
      lastName: this.profileForm.value.lastName ?? undefined,
      email: this.profileForm.value.email ?? undefined,
      phoneNumber: this.profileForm.value.phoneNumber ?? undefined,
    });

    const studentUpdate$ = this.studentProfileService.updateMyProfile({
      cnie: this.profileForm.value.cnie ?? undefined,
      birthDate: this.profileForm.value.birthDate ?? undefined,
    });

    forkJoin([userUpdate$, studentUpdate$])
      .pipe(finalize(() => this.savingProfile.set(false)))
      .subscribe({
        next: ([_, studentProfile]) => {
          this.studentProfile.set(studentProfile);
          this.toast.success('Profil mis à jour avec succès');
        },
        error: () => {
          this.toast.error('Erreur lors de la mise à jour du profil');
        },
      });
  }

  savePassword(): void {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.invalid || this.passwordMismatch) return;

    const current = this.user();
    if (!current) return;

    this.savingPassword.set(true);
    this.usersService
      .updatePassword(current.id, {
        currentPassword: this.passwordForm.value.currentPassword!,
        newPassword: this.passwordForm.value.newPassword!,
        confirmPassword: this.passwordForm.value.confirmPassword!,
      })
      .pipe(finalize(() => this.savingPassword.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Mot de passe mis à jour avec succès');
          this.passwordForm.reset();
        },
        error: () => {
          this.toast.error('Erreur lors de la mise à jour du mot de passe');
        },
      });
  }
}

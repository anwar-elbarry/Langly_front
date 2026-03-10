import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Store } from '@ngrx/store';
import { FormFieldComponent } from '../../ui/form-field/form-field';
import { InputComponent } from '../../ui/input/input';
import { ButtonComponent } from '../../ui/button/button';
import { ToastService } from '../../ui/toast/toast.service';
import { UsersService } from '../../../features/superAdmin/services/users.service';
import { selectCurrentUser } from '../../../core/store/selectors/auth.selectors';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './settings.page.html',
})
export class SettingsPage implements OnInit {
  private usersService = inject(UsersService);
  private store = inject(Store);
  private toast = inject(ToastService);

  user = this.store.selectSignal(selectCurrentUser);

  savingProfile = signal(false);
  savingPassword = signal(false);

  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl(''),
  });

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    const current = this.user();
    if (current) {
      this.profileForm.patchValue({
        firstName: current.firstName ?? '',
        lastName: current.lastName ?? '',
        email: current.email ?? '',
        phoneNumber: current.phoneNumber ?? '',
      });
    }
  }

  get passwordMismatch(): boolean {
    const { newPassword, confirmPassword } = this.passwordForm.value;
    return !!newPassword && !!confirmPassword && newPassword !== confirmPassword;
  }

  saveProfile(): void {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid) return;

    const current = this.user();
    if (!current) return;

    this.savingProfile.set(true);
    this.usersService
      .update(current.id, {
        firstName: this.profileForm.value.firstName ?? undefined,
        lastName: this.profileForm.value.lastName ?? undefined,
        email: this.profileForm.value.email ?? undefined,
        phoneNumber: this.profileForm.value.phoneNumber ?? undefined,
      })
      .pipe(finalize(() => this.savingProfile.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Profile updated successfully');
        },
        error: () => {
          this.toast.error('Failed to update profile');
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
          this.toast.success('Password updated successfully');
          this.passwordForm.reset();
        },
        error: () => {
          this.toast.error('Failed to update password');
        },
      });
  }
}

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthPage } from '../../../../core/store/actions/auth.actions';
import { AuthRequest } from '../../models/Auth.request';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { selectAuthLoading } from '../../../../core/store/selectors/auth.selectors';
import { SpinnerComponent } from "../../../../shared/ui/spinner/spinner";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormFieldComponent, InputComponent, ButtonComponent, SpinnerComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private store = inject(Store);
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  isLoading = this.store.selectSignal(selectAuthLoading);
  showPassword = false;

  get emailError(): string {
    const control = this.form.get('email');
    if (control?.touched && control?.invalid) {
      if (control.hasError('required')) return 'Email is required';
      if (control.hasError('email')) return 'Please enter a valid email address';
    }
    return '';
  }

  get passwordError(): string {
    const control = this.form.get('password');
    if (control?.touched && control?.hasError('required')) {
      return 'Password is required';
    }
    return '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    console.log(this.form.value);
    if (this.form.invalid) return;

    const credentials: AuthRequest = {
      email: this.form.value.email!,
      password: this.form.value.password!,
    };

    this.store.dispatch(AuthPage.login({ credentials }));
  }
}

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthPage } from '../../../../core/store/actions/auth.actions';
import { AuthRequest } from '../../models/Auth.request';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private store = inject(Store);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  showPassword = false;

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

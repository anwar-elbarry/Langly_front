import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Toast, ToastService } from '../../../shared/ui/toast/toast.service';
import { Store } from '@ngrx/store';
import { AuthPage } from '../../store/actions/auth.actions';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const store = inject(Store);
  const suspensionMessage = 'Your account is suspended. Contact Langly SaaS team.';

  return next(req).pipe(
    catchError(error => {
      let message = 'An unexpected error occurred';
      let type: Toast['type'] = 'error';
      const backendMessage = error.error?.message || error.error?.error || error.message || '';
      const isSuspended = typeof backendMessage === 'string' && backendMessage.toLowerCase().includes('suspend');

      if (error.status === 401) {
        if (req.url.includes('/auth/login')) {
          message = isSuspended ? suspensionMessage : (error.error?.message || 'Invalid email or password.');
          type = 'error';
        } else {
          if (isSuspended) {
            message = suspensionMessage;
            type = 'warning';
          } else {
            message = 'Session expired. Please login again.';
            type = 'warning';
          }
          store.dispatch(AuthPage.logout());
        }
      } else if (error.status === 403) {
        message = 'You do not have permission to perform this action.';
        type = 'warning';
      } else if (error.status === 404) {
        message = 'The requested resource was not found.';
        type = 'error';
      } else if (error.status === 500) {
        message = 'Server error. Please try again later.';
        type = 'error';
      } else if (error.error?.message) {
        message = error.error.message;
      } else if (error.message) {
        message = error.message;
      }

      toastService.show(message, type);
      return throwError(() => error);
    })
  );
};

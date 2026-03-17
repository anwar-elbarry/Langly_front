import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Toast, ToastService } from '../../../shared/ui/toast/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError(error => {
      let message = 'An unexpected error occurred';
      let type: Toast['type'] = 'error';

      if (error.status === 401) {
        if (req.url.includes('/auth/login')) {
          message = error.error?.message || 'Invalid email or password.';
          type = 'error';
        } else {
          message = 'Session expired. Please login again.';
          type = 'warning';
          localStorage.removeItem('accessToken');
          router.navigate(['/login']);
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

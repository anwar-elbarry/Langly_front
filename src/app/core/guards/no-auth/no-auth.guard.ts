import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentUser, selectIsAuthenticated, selectUserRole } from '../../store/selectors/auth.selectors';
import { combineLatest, map, take } from 'rxjs';
import { UserStatus } from '../../constants/user.status';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { AuthPage } from '../../store/actions/auth.actions';

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  SUPER_ADMIN: '/superAdmin',
  SCHOOL_ADMIN: '/schoolAdmin',
  TEACHER: '/teacher',
  STUDENT: '/student',
};

export const noAuthGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const toast = inject(ToastService);

  return combineLatest([
    store.select(selectIsAuthenticated),
    store.select(selectUserRole),
    store.select(selectCurrentUser),
  ]).pipe(
    take(1),
    map(([isAuthenticated, role, user]) => {
      if (!isAuthenticated) {
        return true;
      }

      if (user?.status === UserStatus.SUSPENDED) {
        toast.warning('Your account is suspended. Contact Langly SaaS team.');
        store.dispatch(AuthPage.logout());
        return true;
      }

      const dashboard = ROLE_DASHBOARD_MAP[role] ?? '/login';
      return router.createUrlTree([dashboard]);
    })
  );
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated, selectUserRole } from '../../store/selectors/auth.selectors';
import { combineLatest, map, take } from 'rxjs';

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  SUPER_ADMIN: '/superAdmin',
  SCHOOL_ADMIN: '/schoolAdmin',
  TEACHER: '/teacher',
  STUDENT: '/student',
};

export const noAuthGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return combineLatest([
    store.select(selectIsAuthenticated),
    store.select(selectUserRole),
  ]).pipe(
    take(1),
    map(([isAuthenticated, role]) => {
      if (!isAuthenticated) {
        return true;
      }
      const dashboard = ROLE_DASHBOARD_MAP[role] ?? '/login';
      return router.createUrlTree([dashboard]);
    })
  );
};

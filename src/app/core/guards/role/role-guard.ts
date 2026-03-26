import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { combineLatest, map, take } from 'rxjs';
import { selectCurrentUser, selectIsAuthenticated, selectUserRole } from '../../store/selectors/auth.selectors';
import { UserStatus } from '../../constants/user.status';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { AuthPage } from '../../store/actions/auth.actions';

export const roleGuard: CanActivateFn = (route) => {
    const store = inject(Store);
    const router = inject(Router);
    const toast = inject(ToastService);
    const requiredRole = route.data['role'];

    return combineLatest([
        store.select(selectIsAuthenticated),
        store.select(selectUserRole),
        store.select(selectCurrentUser),
    ]).pipe(
        take(1),
        map(([isAuthenticated, role, user]) => {
            if (!isAuthenticated) {
                return router.createUrlTree(['/login']);
            }

            if (user?.status === UserStatus.SUSPENDED) {
                toast.warning('Your account is suspended. Contact Langly SaaS team.');
                store.dispatch(AuthPage.logout());
                return router.createUrlTree(['/login']);
            }

            if (role === requiredRole) {
                return true;
            }

                return router.createUrlTree(['/error/401']);
        })
    );

};

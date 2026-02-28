import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { map, take } from 'rxjs';
import { selectUserRole } from '../../store/selectors/auth.selectors';

export const roleGuard: CanActivateFn = (route) => {
    const store = inject(Store);
    const router = inject(Router);
    const requiredRole = route.data['role']

    return store.select(selectUserRole).pipe(
        take(1),
        map(role => {
            if (role === requiredRole) {
                return true
            } else {
                return router.createUrlTree(['/error/401']);
            }
        })
    )

};

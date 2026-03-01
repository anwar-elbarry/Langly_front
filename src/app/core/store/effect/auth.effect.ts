import { Actions, createEffect, ofType } from "@ngrx/effects";
import { inject, Injectable } from "@angular/core";
import { AuthService } from "../../../features/auth/auth.service";
import { AuthApi, AuthPage } from "../actions/auth.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";
import { RoleEnum } from "../../constants/role.enum";

@Injectable()
export class AuthEffects {

    private actions$ = inject(Actions);
    private authService = inject(AuthService);
    private router = inject(Router);

    // ── Check Auth on App Init ──
    checkAuth$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthPage.checkAuth),
            map(() => {
                const user = this.authService.getCurrentUser();
                if (user) {
                    return AuthApi.checkAuthSuccess({ user });
                }
                return AuthApi.checkAuthFailure();
            })
        )
    );

    // ── Login ──
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthPage.login),
            switchMap((action) =>
                this.authService.login(action.credentials).pipe(
                    map((resp) => AuthApi.loginSuccess({ user: resp.user })),
                    catchError((error) => of(
                        AuthApi.loginFailure({ error: error?.error?.message || error.message || 'Invalid email or password' })
                    ))
                )
            )
        )
    );

    // ── Login Success - Navigate ──
    loginSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthApi.loginSuccess),
            tap(() => {
                if(this.authService.getCurrentUser()?.role?.name === RoleEnum.SUPER_ADMIN) {
                    this.router.navigate(['/superAdmin']);
                } else if(this.authService.getCurrentUser()?.role?.name === RoleEnum.SCHOOL_ADMIN) {
                    this.router.navigate(['/schoolAdmin']);
                } else if(this.authService.getCurrentUser()?.role?.name === RoleEnum.TEACHER) {
                    this.router.navigate(['/teacher']);
                } else if(this.authService.getCurrentUser()?.role?.name === RoleEnum.STUDENT) {
                    this.router.navigate(['/student']);
                }
            })
        ),
        { dispatch: false }
    );

    // ── Logout ──
    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthPage.logout),
            tap(() => {
                this.authService.logout();
                this.router.navigate(['/login']);
            }),
            map(() => AuthApi.logoutSuccess())
        )
    );
}

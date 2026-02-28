import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AuthRequest } from "../../../features/auth/models/Auth.request";
import { UserResponse } from "../../../features/auth/models/User.response";

export const AuthPage = createActionGroup({
    source: 'Auth Page',
    events: {
        'Login': props<{ credentials: AuthRequest }>(),
        'Logout': emptyProps(),
        'Check Auth': emptyProps(),
    }
});

export const AuthApi = createActionGroup({
    source: 'Auth API',
    events: {
        // ── Login ──
        'Login Success': props<{ user: UserResponse }>(),
        'Login Failure': props<{ error: string }>(),

        // ── Logout ──
        'Logout Success': emptyProps(),

        // ── Check Auth ──
        'Check Auth Success': props<{ user: UserResponse }>(),
        'Check Auth Failure': emptyProps(),
    }
});

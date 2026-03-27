import { createFeature, createReducer, on } from "@ngrx/store";
import { AuthApi, AuthPage } from "../actions/auth.actions";
import { UserResponse } from "../../../features/auth/models/User.response";

export interface AuthState {
    readonly user: UserResponse | null;
    readonly isLoading: boolean;
    readonly error: string | null;
    readonly isAuthenticated: boolean;
}

export const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
};

export const authFeature = createFeature({
    name: 'auth',
    reducer: createReducer(
    initialState,

    // ── Check Auth ──
    on(AuthPage.checkAuth, (state) => ({
        ...state,
        isLoading: true,
    })),
    on(AuthApi.checkAuthSuccess, (state, action) => ({
        ...state,
        user: action.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
    })),
    on(AuthApi.checkAuthFailure, (state) => ({
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
    })),

    // ── Login ──
    on(AuthPage.login, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),
    on(AuthApi.loginSuccess, (state, action) => ({
        ...state,
        user: action.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
    })),
    on(AuthApi.loginFailure, (state, action) => ({
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.error,
    })),

    // ── Logout ──
    on(AuthPage.logout, (state) => ({
        ...state,
        isLoading: true,
    })),
    on(AuthApi.logoutSuccess, () => ({
        ...initialState,
    })),
    ),
});

export const authReducer = authFeature.reducer;

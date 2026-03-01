import { createReducer, on } from "@ngrx/store";
import { AuthApi, AuthPage } from "../actions/auth.actions";
import { UserResponse } from "../../../features/auth/models/User.response";

export interface AuthState {
    user: UserResponse | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

export const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
};

export const authReducer = createReducer(
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
);

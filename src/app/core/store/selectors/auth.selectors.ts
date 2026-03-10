import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "../reducers/auth.reducer";

// Feature selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Selectors
export const selectCurrentUser = createSelector(
    selectAuthState,
    (state) => state.user
);

export const selectIsAuthenticated = createSelector(
    selectAuthState,
    (state) => state.isAuthenticated
);

export const selectAuthLoading = createSelector(
    selectAuthState,
    (state) => state.isLoading
);

export const selectAuthError = createSelector(
    selectAuthState,
    (state) => state.error
);

// Composite selectors
export const selectUserFullName = createSelector(
    selectCurrentUser,
    (user) => user ? `${user.firstName} ${user.lastName}` : ''
);

export const selectUserId = createSelector(
    selectCurrentUser,
    (user) => user?.id || ''
);

export const selectUserRole = createSelector(
    selectCurrentUser,
    (user) => user?.role?.name || ''
);

export const selectSchoolId = createSelector(
    selectCurrentUser,
    (user) => user?.schoolId || ''
);

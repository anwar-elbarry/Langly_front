import { createSelector } from "@ngrx/store";
import { authFeature } from "../reducers/auth.reducer";

// Use auto-generated selectors from createFeature()
export const selectAuthState = authFeature.selectAuthState;
export const selectCurrentUser = authFeature.selectUser;
export const selectIsAuthenticated = authFeature.selectIsAuthenticated;
export const selectAuthLoading = authFeature.selectIsLoading;
export const selectAuthError = authFeature.selectError;

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

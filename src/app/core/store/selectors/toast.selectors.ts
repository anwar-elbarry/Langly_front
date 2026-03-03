import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ToastState } from '../reducers/toast.reducer';

export const selectToastState = createFeatureSelector<ToastState>('toast');

export const selectAllToasts = createSelector(
    selectToastState,
    (state) => state.toasts
);

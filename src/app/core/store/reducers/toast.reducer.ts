import { createFeature, createReducer, on } from '@ngrx/store';
import { ToastActions } from '../actions/toast.actions';
import { Toast } from '../../../shared/ui/toast/toast.service';

export interface ToastState {
    readonly toasts: Toast[];
}

export const initialState: ToastState = {
    toasts: [],
};

export const toastFeature = createFeature({
    name: 'toast',
    reducer: createReducer(
        initialState,
        on(ToastActions.addToast, (state, { toast }) => ({
            ...state,
            toasts: [...state.toasts, toast]
        })),
        on(ToastActions.removeToast, (state, { id }) => ({
            ...state,
            toasts: state.toasts.filter(t => t.id !== id)
        }))
    ),
});

export const toastReducer = toastFeature.reducer;

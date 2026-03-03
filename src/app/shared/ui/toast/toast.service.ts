import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastActions } from '../../../core/store/actions/toast.actions';

export interface Toast {
    id: number;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    private store = inject(Store);
    private nextId = 0;

    show(message: string, type: Toast['type'] = 'info', duration = 4000): void {
        const id = this.nextId++;
        this.store.dispatch(ToastActions.addToast({ toast: { id, message, type, duration } }));

        if (duration > 0) {
            setTimeout(() => this.remove(id), duration);
        }
    }

    info(message: string, duration?: number): void {
        this.show(message, 'info', duration);
    }

    success(message: string, duration?: number): void {
        this.show(message, 'success', duration);
    }

    warning(message: string, duration?: number): void {
        this.show(message, 'warning', duration);
    }

    error(message: string, duration?: number): void {
        this.show(message, 'error', duration);
    }

    remove(id: number): void {
        this.store.dispatch(ToastActions.removeToast({ id }));
    }
}

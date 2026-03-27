import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastService } from './toast.service';
import { selectAllToasts } from '../../../core/store/selectors/toast.selectors';

@Component({
    selector: 'app-toast-container',
    imports: [],
    templateUrl: './toast.html',
    styleUrl: './toast.css',
})
export class ToastContainerComponent {
    public toastService = inject(ToastService);
    private store = inject(Store);

    toasts = this.store.selectSignal(selectAllToasts);
}

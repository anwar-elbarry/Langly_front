import { createActionGroup, props } from '@ngrx/store';
import { Toast } from '../../../shared/ui/toast/toast.service';

export const ToastActions = createActionGroup({
    source: 'Toast',
    events: {
        'Add Toast': props<{ toast: Toast }>(),
        'Remove Toast': props<{ id: number }>(),
    }
});

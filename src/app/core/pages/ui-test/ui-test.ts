import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../../../shared/ui/button/button';
import { FormFieldComponent } from '../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../shared/ui/input/input';
import { TextareaComponent } from '../../../shared/ui/textarea/textarea';
import { SelectComponent } from '../../../shared/ui/select/select';
import { CheckboxComponent } from '../../../shared/ui/checkbox/checkbox';
import { RadioComponent } from '../../../shared/ui/radio/radio';
import { CardComponent } from '../../../shared/ui/card/card';
import { AlertComponent } from '../../../shared/ui/alert/alert';
import { ToastContainerComponent } from '../../../shared/ui/toast/toast';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SpinnerComponent } from '../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../shared/ui/table/table';

@Component({
    selector: 'app-ui-test',
    standalone: true,
    imports: [
        CommonModule,
        ButtonComponent,
        FormFieldComponent,
        InputComponent,
        TextareaComponent,
        SelectComponent,
        CheckboxComponent,
        RadioComponent,
        CardComponent,
        AlertComponent,
        ToastContainerComponent,
        ModalComponent,
        SpinnerComponent,
        TableComponent,
    ],
    templateUrl: './ui-test.html',
    styleUrl: './ui-test.css',
})
export class UiTestComponent {
    private toastService = inject(ToastService);
    modalOpen = false;
    selectedRadio = 'option1';

    showToast(type: 'info' | 'success' | 'warning' | 'error'): void {
        const messages: Record<string, string> = {
            info: 'This is an informational toast message.',
            success: 'Operation completed successfully!',
            warning: 'Please check your input.',
            error: 'Something went wrong!',
        };
        this.toastService[type](messages[type]);
    }
}

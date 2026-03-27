import { Component, input } from '@angular/core';

@Component({
    selector: 'app-form-field',
    templateUrl: './form-field.html',
    styleUrl: './form-field.css',
})
export class FormFieldComponent {
    readonly label = input('');
    readonly error = input('');
    readonly hint = input('');
    readonly required = input(false);
}

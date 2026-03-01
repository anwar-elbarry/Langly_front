import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-form-field',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './form-field.html',
    styleUrl: './form-field.css',
})
export class FormFieldComponent {
    @Input() label = '';
    @Input() error = '';
    @Input() hint = '';
    @Input() required = false;
}

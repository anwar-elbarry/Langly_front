import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './input.html',
    styleUrl: './input.css',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputComponent), multi: true }
    ]
})
export class InputComponent implements ControlValueAccessor {
    @Input() type: string = 'text';
    @Input() placeholder = '';
    @Input() disabled = false;
    @Input() error = false;

    value = '';
    onChange: (val: string) => void = () => { };
    onTouched: () => void = () => { };

    writeValue(val: string): void { this.value = val || ''; }
    registerOnChange(fn: (val: string) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
    setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

    onInput(event: Event): void {
        const val = (event.target as HTMLInputElement).value;
        this.value = val;
        this.onChange(val);
    }
}

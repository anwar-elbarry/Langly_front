import { Component, input, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-input',
    imports: [FormsModule],
    templateUrl: './input.html',
    styleUrl: './input.css',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputComponent), multi: true }
    ]
})
export class InputComponent implements ControlValueAccessor {
    readonly type = input('text');
    readonly placeholder = input('');
    readonly error = input(false);
    readonly min = input('');
    readonly max = input('');

    disabled = signal(false);
    value = '';
    onChange: (val: string) => void = () => { };
    onTouched: () => void = () => { };

    writeValue(val: string): void { this.value = val || ''; }
    registerOnChange(fn: (val: string) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
    setDisabledState(isDisabled: boolean): void { this.disabled.set(isDisabled); }

    onInput(event: Event): void {
        const val = (event.target as HTMLInputElement).value;
        this.value = val;
        this.onChange(val);
    }
}

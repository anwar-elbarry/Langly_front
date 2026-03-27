import { Component, input, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-textarea',
    imports: [FormsModule],
    templateUrl: './textarea.html',
    styleUrl: './textarea.css',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextareaComponent), multi: true }
    ]
})
export class TextareaComponent implements ControlValueAccessor {
    readonly placeholder = input('');
    readonly rows = input(4);
    readonly error = input(false);

    disabled = signal(false);
    value = '';
    onChange: (val: string) => void = () => { };
    onTouched: () => void = () => { };

    writeValue(val: string): void { this.value = val || ''; }
    registerOnChange(fn: (val: string) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
    setDisabledState(isDisabled: boolean): void { this.disabled.set(isDisabled); }

    onInput(event: Event): void {
        const val = (event.target as HTMLTextAreaElement).value;
        this.value = val;
        this.onChange(val);
    }
}

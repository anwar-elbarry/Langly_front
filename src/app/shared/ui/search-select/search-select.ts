import { Component, Input, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export interface Option {
    id: any;
    label: string;
}

@Component({
    selector: 'app-search-select',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './search-select.html',
    styleUrl: './search-select.css',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SearchSelectComponent), multi: true }
    ]
})
export class SearchSelectComponent implements ControlValueAccessor {
    @Input() disabled = false;
    @Input() error = false;
    @Input() placeholder = 'Search and select...';
    @Input() options: Option[] = [];

    searchTerm = signal('');
    showDropdown = signal(false);
    selected = signal<Option | null>(null);

    filtered = computed(() => {
        const term = this.searchTerm().toLowerCase();
        return this.options.filter(o => o.label.toLowerCase().includes(term));
    });

    onChange: (val: any) => void = () => { };
    onTouched: () => void = () => { };

    writeValue(val: any): void {
        if (val !== undefined && val !== null) {
            const option = this.options.find(o => o.id === val);
            if (option) {
                this.selected.set(option);
                this.searchTerm.set(option.label);
            } else {
                this.selected.set(null);
                this.searchTerm.set('');
            }
        } else {
            this.selected.set(null);
            this.searchTerm.set('');
        }
    }

    registerOnChange(fn: (val: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
    setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

    onInput(event: Event) {
        const val = (event.target as HTMLInputElement).value;
        this.searchTerm.set(val);
        this.showDropdown.set(true);
        if (this.selected()) {
            this.selected.set(null);
            this.onChange(null);
        }
    }

    select(opt: Option) {
        this.selected.set(opt);
        this.searchTerm.set(opt.label);
        this.showDropdown.set(false);
        this.onChange(opt.id);
    }

    onBlur() {
        this.onTouched();
        setTimeout(() => {
            this.showDropdown.set(false);
            if (!this.selected() && this.searchTerm() !== '') {
                this.searchTerm.set('');
            } else if (this.selected()) {
                this.searchTerm.set(this.selected()!.label);
            }
        }, 200);
    }
}

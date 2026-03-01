import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-radio',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './radio.html',
    styleUrl: './radio.css',
})
export class RadioComponent {
    @Input() label = '';
    @Input() name = '';
    @Input() value = '';
    @Input() checked = false;
    @Input() disabled = false;
    @Output() selected = new EventEmitter<string>();

    onSelect(): void {
        if (this.disabled) return;
        this.selected.emit(this.value);
    }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-checkbox',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './checkbox.html',
    styleUrl: './checkbox.css',
})
export class CheckboxComponent {
    @Input() label = '';
    @Input() checked = false;
    @Input() disabled = false;
    @Output() checkedChange = new EventEmitter<boolean>();

    toggle(): void {
        if (this.disabled) return;
        this.checked = !this.checked;
        this.checkedChange.emit(this.checked);
    }
}

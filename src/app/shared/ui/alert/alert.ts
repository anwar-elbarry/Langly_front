import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './alert.html',
    styleUrl: './alert.css',
})
export class AlertComponent {
    @Input() type: 'info' | 'success' | 'warning' | 'error' = 'info';
    @Input() dismissible = false;
    @Output() dismissed = new EventEmitter<void>();

    visible = true;

    dismiss(): void {
        this.visible = false;
        this.dismissed.emit();
    }
}

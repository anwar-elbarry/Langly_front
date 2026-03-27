import { Component, input, output, signal } from '@angular/core';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.html',
    styleUrl: './alert.css',
})
export class AlertComponent {
    readonly type = input<'info' | 'success' | 'warning' | 'error'>('info');
    readonly dismissible = input(false);
    readonly dismissed = output<void>();

    visible = signal(true);

    dismiss(): void {
        this.visible.set(false);
        this.dismissed.emit();
    }
}

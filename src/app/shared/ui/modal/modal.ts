import { Component, input, output, HostListener } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.html',
    styleUrl: './modal.css',
})
export class ModalComponent {
    readonly isOpen = input(false);
    readonly closeOnBackdrop = input(true);
    readonly closed = output<void>();

    onBackdropClick(): void {
        if (this.closeOnBackdrop()) {
            this.close();
        }
    }

    close(): void {
        this.closed.emit();
    }

    @HostListener('document:keydown.escape')
    onEscape(): void {
        if (this.isOpen()) {
            this.close();
        }
    }
}

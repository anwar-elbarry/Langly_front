import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './modal.html',
    styleUrl: './modal.css',
})
export class ModalComponent {
    @Input() isOpen = false;
    @Input() closeOnBackdrop = true;
    @Output() closed = new EventEmitter<void>();

    onBackdropClick(): void {
        if (this.closeOnBackdrop) {
            this.close();
        }
    }

    close(): void {
        this.closed.emit();
    }

    @HostListener('document:keydown.escape')
    onEscape(): void {
        if (this.isOpen) {
            this.close();
        }
    }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './button.html',
    styleUrl: './button.css',
})
export class ButtonComponent {
    @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'link' = 'primary';
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() disabled = false;
    @Input() loading = false;
    @Input() fullWidth = false;
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
}

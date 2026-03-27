import { Component, input } from '@angular/core';

@Component({
    selector: 'app-button',
    templateUrl: './button.html',
    styleUrl: './button.css',
})
export class ButtonComponent {
    readonly variant = input<'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'link'>('primary');
    readonly size = input<'sm' | 'md' | 'lg'>('md');
    readonly disabled = input(false);
    readonly loading = input(false);
    readonly fullWidth = input(false);
    readonly type = input<'button' | 'submit' | 'reset'>('button');
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-select',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './select.html',
    styleUrl: './select.css',
})
export class SelectComponent {
    @Input() disabled = false;
    @Input() error = false;
}

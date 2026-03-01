import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './card.html',
    styleUrl: './card.css',
})
export class CardComponent {
    @Input() hoverable = false;
    @Input() imageSrc = '';
    @Input() imageAlt = '';
}

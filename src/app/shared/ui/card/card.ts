import { Component, input } from '@angular/core';

@Component({
    selector: 'app-card',
    templateUrl: './card.html',
    styleUrl: './card.css',
})
export class CardComponent {
    readonly hoverable = input(false);
    readonly imageSrc = input('');
    readonly imageAlt = input('');
}

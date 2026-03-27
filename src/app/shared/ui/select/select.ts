import { Component, input } from '@angular/core';

@Component({
    selector: 'app-select',
    templateUrl: './select.html',
    styleUrl: './select.css',
})
export class SelectComponent {
    readonly disabled = input(false);
    readonly error = input(false);
}

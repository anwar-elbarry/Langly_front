import { Component, input, output } from '@angular/core';

@Component({
    selector: 'app-radio',
    templateUrl: './radio.html',
    styleUrl: './radio.css',
})
export class RadioComponent {
    readonly label = input('');
    readonly name = input('');
    readonly value = input('');
    readonly checked = input(false);
    readonly disabled = input(false);
    readonly selected = output<string>();

    onSelect(): void {
        if (this.disabled()) return;
        this.selected.emit(this.value());
    }
}

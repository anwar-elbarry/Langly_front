import { Component, input, output, model } from '@angular/core';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.html',
    styleUrl: './checkbox.css',
})
export class CheckboxComponent {
    readonly label = input('');
    readonly checked = model(false);
    readonly disabled = input(false);

    toggle(): void {
        if (this.disabled()) return;
        this.checked.update(v => !v);
    }
}

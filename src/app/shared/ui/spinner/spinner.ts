import { Component, input } from '@angular/core';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.html',
    styleUrl: './spinner.css',
})
export class SpinnerComponent {
    readonly size = input<'sm' | 'md' | 'lg'>('md');
    readonly color = input<'accent' | 'white' | 'muted'>('accent');
}

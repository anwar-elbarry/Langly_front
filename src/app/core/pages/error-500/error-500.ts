import { Component } from '@angular/core';

@Component({
  selector: 'app-error-500',
  imports: [],
  templateUrl: './error-500.html',
  styleUrl: './error-500.css',
})
export class Error500 {

  reload(): void {
    window.location.reload();
  }
}

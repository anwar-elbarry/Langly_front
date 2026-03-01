import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthPage } from './core/store/actions/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Langly_front');

  private store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(AuthPage.checkAuth());
  }
}

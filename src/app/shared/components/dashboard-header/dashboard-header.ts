import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationBellComponent } from '../notification-bell/notification-bell';

@Component({
  selector: 'app-dashboard-header',
  imports: [RouterLink, NotificationBellComponent],
  templateUrl: './dashboard-header.html',
})
export class DashboardHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly fullName = input('');
  readonly initials = input('');
  readonly profileImage = input<string | undefined>('');
  readonly alertsCount = input(0);
  readonly alertsRoute = input('');
  readonly showingAlerts = input(false);

  readonly toggleSidebar = output<void>();

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}

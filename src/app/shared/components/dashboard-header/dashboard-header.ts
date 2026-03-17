import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationBellComponent } from '../notification-bell/notification-bell';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterLink, NotificationBellComponent],
  templateUrl: './dashboard-header.html',
})
export class DashboardHeaderComponent {
  @Input({ required: true }) title: string = '';
  @Input() subtitle: string = '';
  @Input() fullName: string = '';
  @Input() initials: string = '';
  @Input() profileImage: string | undefined = '';
  @Input() alertsCount: number = 0;
  @Input() alertsRoute: string = '';
  @Input() showingAlerts: boolean = false;

  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}

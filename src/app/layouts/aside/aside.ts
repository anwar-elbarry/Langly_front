import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarModel } from '../../core/models/sideBar.model';

@Component({
  selector: 'app-dashboard-aside',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './aside.html',
})
export class DashboardAsideComponent {
  @Input() isSidebarOpen = false;
  @Input() isSidebarCollapsed = false;

  @Input() navItems: SidebarModel[] = [];
  @Input() bottomNavItems: SidebarModel[] = [];

  @Input() logoIcon = 'fa-solid fa-language';
  @Input() badgeLabel = 'Admin';
  @Input() roleLabel = 'Administrateur';

  @Input() accentBg = 'bg-blue-50';
  @Input() accentText = 'text-blue-600';
  @Input() gradientFrom = 'from-blue-600';
  @Input() gradientTo = 'to-sky-500';

  @Input() fullName = '';
  @Input() initials = '';
  @Input() profileImage: string | undefined;

  @Output() closeSidebar = new EventEmitter<void>();
  @Output() toggleCollapse = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onCloseSidebar(): void {
    this.closeSidebar.emit();
  }

  onToggleCollapse(): void {
    this.toggleCollapse.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }
}

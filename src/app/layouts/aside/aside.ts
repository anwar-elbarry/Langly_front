import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarModel } from '../../core/models/sideBar.model';

@Component({
  selector: 'app-dashboard-aside',
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './aside.html',
})
export class DashboardAsideComponent {
  readonly isSidebarOpen = input(false);
  readonly isSidebarCollapsed = input(false);

  readonly navItems = input<SidebarModel[]>([]);
  readonly bottomNavItems = input<SidebarModel[]>([]);

  readonly logoIcon = input('fa-solid fa-language');
  readonly badgeLabel = input('Admin');
  readonly roleLabel = input('Administrateur');

  readonly accentBg = input('bg-blue-50');
  readonly accentText = input('text-blue-600');
  readonly gradientFrom = input('from-blue-600');
  readonly gradientTo = input('to-sky-500');

  readonly fullName = input('');
  readonly initials = input('');
  readonly profileImage = input<string | undefined>();

  readonly closeSidebar = output<void>();
  readonly toggleCollapse = output<void>();
  readonly logout = output<void>();

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

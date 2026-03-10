import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthPage } from '../../../../core/store/actions/auth.actions';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-container.html',
})
export class DashboardContainer {
  private store = inject(Store);

  isSidebarOpen = signal(false);
  isSidebarCollapsed = signal(false);

  user = this.store.selectSignal(selectCurrentUser);
  fullName = computed(() => {
    const current = this.user();
    const first = current?.firstName ?? '';
    const last = current?.lastName ?? '';
    return `${first} ${last}`.trim() || 'Super Admin';
  });
  initials = computed(() => {
    const parts = this.fullName()
      .split(' ')
      .filter(Boolean);
    if (!parts.length) return 'SA';
    const first = parts[0][0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return `${first}${second}`.toUpperCase();
  });

  navItems = [
    { label: 'Overview', route: '/superAdmin/overview', icon: 'fa-solid fa-house' },
    { label: 'Schools', route: '/superAdmin/schools', icon: 'fa-solid fa-school' },
    { label: 'Users', route: '/superAdmin/users', icon: 'fa-solid fa-users' },
    { label: 'Super Admins', route: '/superAdmin/super-admins', icon: 'fa-solid fa-user-shield' },
    {
      label: 'Roles & Permissions',
      route: '/superAdmin/roles-permissions',
      icon: 'fa-solid fa-lock',
    },
    {
      label: 'Subscriptions',
      route: '/superAdmin/subscriptions',
      icon: 'fa-solid fa-credit-card',
    },
  ];

  bottomNavItems = [
    { label: 'Settings', route: '/superAdmin/settings', icon: 'fa-solid fa-gear' },
  ];

  toggleSidebar(): void {
    this.isSidebarOpen.update((value) => !value);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  toggleCollapse(): void {
    this.isSidebarCollapsed.update((value) => !value);
  }

  logout(): void {
    this.store.dispatch(AuthPage.logout());
  }
}

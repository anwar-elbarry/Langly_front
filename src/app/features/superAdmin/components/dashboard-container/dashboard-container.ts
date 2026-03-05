import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthPage } from '../../../../core/store/actions/auth.actions';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { ButtonComponent } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ButtonComponent],
  templateUrl: './dashboard-container.html',
  styleUrl: './dashboard-container.css',
})
export class DashboardContainer {
  private store = inject(Store);

  isSidebarOpen = signal(false);
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
    { label: 'Overview', route: '/superAdmin/overview' },
    { label: 'Schools', route: '/superAdmin/schools' },
    { label: 'Users', route: '/superAdmin/users' },
    { label: 'Super Admins', route: '/superAdmin/super-admins' },
    { label: 'Roles & Permissions', route: '/superAdmin/roles-permissions' },
    { label: 'Subscriptions', route: '/superAdmin/subscriptions' },
  ];

  toggleSidebar(): void {
    this.isSidebarOpen.update((value) => !value);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  logout(): void {
    this.store.dispatch(AuthPage.logout());
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthPage } from '../../../../core/store/actions/auth.actions';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { DashboardAsideComponent } from '../../../../layouts/aside/aside';
import { DashboardHeaderComponent } from '../../../../shared/components/dashboard-header/dashboard-header';

@Component({
  selector: 'app-dashboard-container',
  imports: [RouterOutlet, DashboardAsideComponent, DashboardHeaderComponent],
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
    { label: 'Vue d\'ensemble', route: '/superAdmin/overview', icon: 'fa-solid fa-house' },
    { label: 'Écoles', route: '/superAdmin/schools', icon: 'fa-solid fa-school' },
    { label: 'Utilisateurs', route: '/superAdmin/users', icon: 'fa-solid fa-users' },
    { label: 'Super Admins', route: '/superAdmin/super-admins', icon: 'fa-solid fa-user-shield' },
    {
      label: 'Abonnements',
      route: '/superAdmin/subscriptions',
      icon: 'fa-solid fa-credit-card',
    },
  ];

  bottomNavItems = [
    { label: 'Paramètres', route: '/superAdmin/settings', icon: 'fa-solid fa-gear' },
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

import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthPage } from '../../../../core/store/actions/auth.actions';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { DashboardAsideComponent } from '../../../../layouts/aside/aside';
import { DashboardHeaderComponent } from '../../../../shared/components/dashboard-header/dashboard-header';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DashboardAsideComponent, DashboardHeaderComponent],
  templateUrl: './dashboard-container.html',
  styleUrl: './dashboard-container.css',
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
    return `${first} ${last}`.trim() || 'Étudiant';
  });
  initials = computed(() => {
    const parts = this.fullName().split(' ').filter(Boolean);
    if (!parts.length) return 'ET';
    const first = parts[0][0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return `${first}${second}`.toUpperCase();
  });

  navItems = [
    { label: 'Mes Cours', route: '/student/courses', icon: 'fa-solid fa-book-open' },
    { label: "S'inscrire", route: '/student/enroll', icon: 'fa-solid fa-plus-circle' },
    { label: 'Certificats', route: '/student/certifications', icon: 'fa-solid fa-certificate' },
    { label: 'Factures', route: '/student/invoices', icon: 'fa-solid fa-file-invoice' },
  ];

  bottomNavItems = [
    { label: 'Paramètres', route: '/student/settings', icon: 'fa-solid fa-gear' },
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

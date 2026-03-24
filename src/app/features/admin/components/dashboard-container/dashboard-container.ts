import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthPage } from '../../../../core/store/actions/auth.actions';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { DashboardAsideComponent } from '../../../../layouts/aside/aside';
import { DashboardHeaderComponent } from '../../../../shared/components/dashboard-header/dashboard-header';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DashboardAsideComponent, DashboardHeaderComponent],
  templateUrl: './dashboard-container.html',
})
export class DashboardContainer implements OnInit {
  private store = inject(Store);
  private studentService = inject(StudentService);

  isSidebarOpen = signal(false);
  isSidebarCollapsed = signal(false);
  incompleteCount = signal(0);

  user = this.store.selectSignal(selectCurrentUser);
  fullName = computed(() => {
    const current = this.user();
    const first = current?.firstName ?? '';
    const last = current?.lastName ?? '';
    return `${first} ${last}`.trim() || 'Directeur';
  });
  initials = computed(() => {
    const parts = this.fullName().split(' ').filter(Boolean);
    if (!parts.length) return 'DA';
    const first = parts[0][0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return `${first}${second}`.toUpperCase();
  });

  navItems = [
    { label: 'Accueil', route: '/schoolAdmin/home', icon: 'fa-solid fa-house' },
    { label: 'Équipe', route: '/schoolAdmin/team', icon: 'fa-solid fa-users' },
    { label: 'Cours', route: '/schoolAdmin/courses', icon: 'fa-solid fa-book' },
    { label: 'Élèves', route: '/schoolAdmin/students', icon: 'fa-solid fa-user-graduate' },
    { label: 'Inscriptions', route: '/schoolAdmin/enrollments', icon: 'fa-solid fa-clipboard-list' },
    { label: 'Factures', route: '/schoolAdmin/invoices', icon: 'fa-solid fa-file-invoice' },
    { label: 'Remises', route: '/schoolAdmin/discounts', icon: 'fa-solid fa-tags' },
    { label: 'Catalogue de frais', route: '/schoolAdmin/fee-templates', icon: 'fa-solid fa-list-check' },
    { label: 'Param. facturation', route: '/schoolAdmin/billing-settings', icon: 'fa-solid fa-sliders' },
    { label: 'Abonnement', route: '/schoolAdmin/subscription', icon: 'fa-solid fa-credit-card' },
    { label: 'Alertes', route: '/schoolAdmin/alerts', icon: 'fa-solid fa-triangle-exclamation' },
  ];

  bottomNavItems = [
    { label: 'Paramètres', route: '/schoolAdmin/settings', icon: 'fa-solid fa-gear' },
  ];

  ngOnInit(): void {
    const schoolId = this.user()?.schoolId;
    if (schoolId) {
      this.studentService.getIncomplete(schoolId).subscribe({
        next: (students) => this.incompleteCount.set(students.length),
      });
    }
  }

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

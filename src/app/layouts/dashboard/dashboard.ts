import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SidebarModel } from '../../core/models/sideBar.model';
import { Store } from '@ngrx/store';
import { selectUserRole } from '../../core/store/selectors/auth.selectors';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private store = inject(Store);

  isCollapsed = signal(false);

  private role = toSignal(this.store.select(selectUserRole), { initialValue: '' });

  menuItems = signal<SidebarModel[]>([
    { label: 'users', icon: 'fa-solid fa-user', route: '/dashboard/users' },
    { label: 'Paramètres', icon: 'fa-solid fa-gear', route: '/settings' }
  ]);

  filteredMenu = computed(() => {
    const role = this.role();

    return this.menuItems().filter(item => {
      if (!item.roles || item.roles.length === 0) return true;
      if (!role) return false;
      return item.roles.some(r => r.name === role);
    });
  });

  toggleSidebar() {
    this.isCollapsed.update(val => !val);
  }
}

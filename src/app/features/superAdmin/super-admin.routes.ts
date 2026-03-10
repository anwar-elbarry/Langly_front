import { Routes } from '@angular/router';

export const SUPER_ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard-container/dashboard-container').then((m) => m.DashboardContainer),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () => import('./pages/overview/overview.page').then((m) => m.OverviewPage),
      },
      {
        path: 'schools',
        loadComponent: () => import('./pages/schools/schools.page').then((m) => m.SchoolsPage),
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users.page').then((m) => m.UsersPage),
      },
      {
        path: 'super-admins',
        loadComponent: () =>
          import('./pages/super-admins/super-admins.page').then((m) => m.SuperAdminsPage),
      },
      {
        path: 'roles-permissions',
        loadComponent: () =>
          import('./pages/roles-permissions/roles-permissions.page').then(
            (m) => m.RolesPermissionsPage
          ),
      },
      {
        path: 'roles',
        redirectTo: 'roles-permissions',
        pathMatch: 'full',
      },
      {
        path: 'permissions',
        redirectTo: 'roles-permissions',
        pathMatch: 'full',
      },
      {
        path: 'subscriptions',
        loadComponent: () =>
          import('./pages/subscriptions/subscriptions.page').then((m) => m.SubscriptionsPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../../shared/components/settings/settings.page').then((m) => m.SettingsPage),
      },
    ],
  },
];


import { Routes } from '@angular/router';

export const SCHOOL_ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard-container/dashboard-container').then(
        (m) => m.DashboardContainer
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'team',
        loadComponent: () =>
          import('./pages/team/team.page').then((m) => m.TeamPage),
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./pages/courses/courses.page').then((m) => m.CoursesPage),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./pages/students/students.page').then((m) => m.StudentsPage),
      },
      {
        path: 'students/:id',
        loadComponent: () =>
          import('./pages/students/student-detail.page').then(
            (m) => m.StudentDetailPage
          ),
      },
      {
        path: 'enrollments',
        loadComponent: () =>
          import('./pages/enrollments/enrollments.page').then(
            (m) => m.EnrollmentsPage
          ),
      },
      {
        path: 'billings',
        loadComponent: () =>
          import('./pages/billings/billings.page').then(
            (m) => m.BillingsPage
          ),
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./pages/alerts/alerts.page').then((m) => m.AlertsPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../../shared/components/settings/settings.page').then((m) => m.SettingsPage),
      },
    ],
  },
];

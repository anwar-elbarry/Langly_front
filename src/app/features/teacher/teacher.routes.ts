import { Routes } from '@angular/router';

export const TEACHER_ROUTES: Routes = [
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
        path: 'courses',
        loadComponent: () =>
          import('./pages/courses/courses.page').then((m) => m.CoursesPage),
      },
      {
        path: 'courses/:id',
        loadComponent: () =>
          import('./pages/course-detail/course-detail.page').then(
            (m) => m.CourseDetailPage
          ),
      },
      {
        path: 'attendance/:sessionId',
        loadComponent: () =>
          import('./pages/attendance/attendance.page').then(
            (m) => m.AttendancePage
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../../shared/components/settings/settings.page').then(
            (m) => m.SettingsPage
          ),
      },
    ],
  },
];

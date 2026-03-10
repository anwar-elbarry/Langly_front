import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
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
                redirectTo: 'courses',
            },
            {
                path: 'courses',
                loadComponent: () =>
                    import('./pages/my-courses/my-courses.page').then((m) => m.MyCoursesPage),
            },
            {
                path: 'courses/:id',
                loadComponent: () =>
                    import('./pages/course-detail/course-detail.page').then((m) => m.CourseDetailPage),
            },
            {
                path: 'enroll',
                loadComponent: () =>
                    import('./pages/enroll/enroll.page').then((m) => m.EnrollPage),
            },
            {
                path: 'attendance',
                loadComponent: () =>
                    import('./pages/attendance/attendance.page').then((m) => m.AttendancePage),
            },
            {
                path: 'certifications',
                loadComponent: () =>
                    import('./pages/certifications/certifications.page').then((m) => m.CertificationsPage),
            },
            {
                path: 'settings',
                loadComponent: () =>
                    import('../../shared/components/settings/settings.page').then((m) => m.SettingsPage),
            },
        ],
    },
];

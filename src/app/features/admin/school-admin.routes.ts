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
        redirectTo: 'invoices',
        pathMatch: 'full',
      },
      {
        path: 'invoices',
        loadComponent: () =>
          import('./pages/invoices/invoices.page').then(
            (m) => m.InvoicesPage
          ),
      },
      {
        path: 'invoices/:id',
        loadComponent: () =>
          import('./pages/invoices/invoice-detail.page').then(
            (m) => m.InvoiceDetailPage
          ),
      },
      {
        path: 'fee-payments',
        loadComponent: () =>
          import('./pages/fee-payments/fee-payments.page').then(
            (m) => m.FeePaymentsPage
          ),
      },
      {
        path: 'discounts',
        loadComponent: () =>
          import('./pages/discounts/discounts.page').then(
            (m) => m.DiscountsPage
          ),
      },
      {
        path: 'fee-templates',
        loadComponent: () =>
          import('./pages/fee-templates/fee-templates.page').then(
            (m) => m.FeeTemplatesPage
          ),
      },
      {
        path: 'billing-settings',
        loadComponent: () =>
          import('./pages/billing-settings/billing-settings.page').then(
            (m) => m.BillingSettingsPage
          ),
      },
      {
        path: 'subscription',
        loadComponent: () =>
          import('./pages/subscription/subscription.page').then(
            (m) => m.SubscriptionPage
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

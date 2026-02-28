import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login').then(m => m.Login)
  },
  {
    path:'superAdmin',
    loadComponent:() => import('./features/superAdmin/components/dashboard-container/dashboard-container').then(m => m.DashboardContainer)
  },
  {
    path:'schoolAdmin',
    loadComponent:() => import('./features/admin/components/dashboard-container/dashboard-container').then(m => m.DashboardContainer)
  },
  {
    path:'teacher',
    loadComponent:() => import('./features/teacher/components/dashboard-container/dashboard-container').then(m => m.DashboardContainer)
  },
  {
    path:'student',
    loadComponent:() => import('./features/student/components/dashboard-container/dashboard-container').then(m => m.DashboardContainer)
  }
];

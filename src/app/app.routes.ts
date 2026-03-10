import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role/role-guard';
import { RoleEnum } from './core/constants/role.enum';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login').then(m => m.Login)
  },
  {
    path: 'superAdmin',
    canActivate: [roleGuard],
    data: { role: RoleEnum.SUPER_ADMIN },
    loadChildren: () => import('./features/superAdmin/super-admin.routes').then(m => m.SUPER_ADMIN_ROUTES),
  },
  {
    path: 'schoolAdmin',
    canActivate: [roleGuard],
    data: { role: RoleEnum.SCHOOL_ADMIN },
    loadChildren: () => import('./features/admin/school-admin.routes').then(m => m.SCHOOL_ADMIN_ROUTES),
  },
  {
    path: 'teacher',
    loadComponent: () => import('./features/teacher/components/dashboard-container/dashboard-container').then(m => m.DashboardContainer),
    canActivate: [roleGuard],
    data: { role: RoleEnum.TEACHER }
  },
  {
    path: 'student',
    canActivate: [roleGuard],
    data: { role: RoleEnum.STUDENT },
    loadChildren: () => import('./features/student/student.routes').then(m => m.STUDENT_ROUTES),
  },
  {
    path: 'error/401',
    loadComponent: () => import('./core/pages/error-401/error-401').then(m => m.Error401)
  },
  {
    path: 'error/404',
    loadComponent: () => import('./core/pages/error-404/error-404').then(m => m.Error404)
  },
  {
    path: 'error/500',
    loadComponent: () => import('./core/pages/error-500/error-500').then(m => m.Error500)
  },
  {
    path: 'test',
    loadComponent: () => import('./core/pages/ui-test/ui-test').then(m => m.UiTestComponent)
  },
  {
    path: '**',
    redirectTo: 'error/404'
  }
];

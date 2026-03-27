import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated, selectUserRole } from '../../core/store/selectors/auth.selectors';

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  SUPER_ADMIN: '/superAdmin',
  SCHOOL_ADMIN: '/schoolAdmin',
  TEACHER: '/teacher',
  STUDENT: '/student',
};

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css']
})
export class HomePage {
  private store = inject(Store);

  readonly year = new Date().getFullYear();
  readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  readonly dashboardRoute = computed(() => {
    const role = this.store.selectSignal(selectUserRole)();
    return ROLE_DASHBOARD_MAP[role] ?? '/login';
  });

  features = [
    {
      icon: '🎓',
      title: 'Smart Learning Paths',
      desc: 'AI-powered curricula that adapt to each student\'s pace and learning style.'
    },
    {
      icon: '🏫',
      title: 'School Management',
      desc: 'Manage classes, enrollments, teachers and students from one unified dashboard.'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      desc: 'Track progress, attendance and performance with live insights and reports.'
    },
    {
      icon: '📜',
      title: 'Digital Certificates',
      desc: 'Automatically generate and deliver PDF certificates upon course completion.'
    },
    {
      icon: '💬',
      title: 'Multilingual Support',
      desc: 'Deliver education in any language — built for global classrooms.'
    },
    {
      icon: '🔐',
      title: 'Role-based Access',
      desc: 'Granular permissions for Super Admins, School Admins, Teachers and Students.'
    }
  ];

  stats = [
    { value: '10K+', label: 'Students Enrolled' },
    { value: '500+', label: 'Schools Onboarded' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '40+', label: 'Languages Supported' },
  ];
}


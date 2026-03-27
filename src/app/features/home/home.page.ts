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
      icon: 'fa-solid fa-graduation-cap',
      title: 'Smart Learning Paths',
      desc: 'AI-powered curricula that adapt to each student\'s pace and learning style.'
    },
    {
      icon: 'fa-solid fa-building-columns',
      title: 'School Management',
      desc: 'Manage classes, enrollments, teachers and students from one unified dashboard.'
    },
    {
      icon: 'fa-solid fa-chart-line',
      title: 'Real-time Analytics',
      desc: 'Track progress, attendance and performance with live insights and reports.'
    },
    {
      icon: 'fa-solid fa-certificate',
      title: 'Digital Certificates',
      desc: 'Automatically generate and deliver PDF certificates upon course completion.'
    },
    {
      icon: 'fa-solid fa-language',
      title: 'Multilingual Support',
      desc: 'Deliver education in any language — built for global classrooms.'
    },
    {
      icon: 'fa-solid fa-shield-halved',
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

  howItWorks = [
    {
      step: 1,
      icon: 'fa-solid fa-school',
      title: 'Create Your School',
      desc: 'Set up your institution in minutes — add your logo, configure settings and invite your team.'
    },
    {
      step: 2,
      icon: 'fa-solid fa-chalkboard-user',
      title: 'Add Courses & Teachers',
      desc: 'Build your curriculum, assign teachers, set schedules and define enrollment capacities.'
    },
    {
      step: 3,
      icon: 'fa-solid fa-rocket',
      title: 'Enroll & Track Progress',
      desc: 'Enroll students, track attendance in real-time and issue certificates upon completion.'
    }
  ];

  testimonials = [
    {
      quote: 'Langly transformed how we manage our language school. Enrollment, billing and certificates — all in one place.',
      name: 'Sarah Mitchell',
      role: 'School Director, EduLingua Academy',
      initials: 'SM'
    },
    {
      quote: 'The real-time analytics help me track each student\'s progress and adapt my teaching instantly.',
      name: 'David Chen',
      role: 'Senior Teacher, GlobalSpeak',
      initials: 'DC'
    },
    {
      quote: 'As a student, I love having all my courses, materials and certificates accessible from one dashboard.',
      name: 'Amira El-Khoury',
      role: 'Student, LinguaBridge',
      initials: 'AE'
    }
  ];

  trustedLogos = [
    { name: 'EduLingua' },
    { name: 'GlobalSpeak' },
    { name: 'LinguaBridge' },
    { name: 'PolyglotHub' },
    { name: 'VoxAcademy' },
  ];
}


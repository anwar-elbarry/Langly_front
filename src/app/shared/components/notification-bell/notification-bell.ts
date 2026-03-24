import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval, switchMap, startWith } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationResponse } from '../../../core/models/notification.model';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.html',
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  unreadCount = signal(0);
  notifications = signal<NotificationResponse[]>([]);
  showDropdown = signal(false);
  loading = signal(false);

  private pollSub?: Subscription;

  ngOnInit(): void {
    // Poll unread count every 30 seconds
    this.pollSub = interval(30_000)
      .pipe(
        startWith(0),
        switchMap(() => this.notificationService.getUnreadCount())
      )
      .subscribe({
        next: (count) => this.unreadCount.set(count),
      });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  toggleDropdown(): void {
    const isOpen = !this.showDropdown();
    this.showDropdown.set(isOpen);
    if (isOpen) {
      this.loadNotifications();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown.set(false);
    }
  }

  private loadNotifications(): void {
    this.loading.set(true);
    this.notificationService.getAll().subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  markAsRead(notification: NotificationResponse): void {
    if (notification.status === 'UNREAD') {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          this.notifications.update((list) =>
            list.map((n) =>
              n.id === notification.id ? { ...n, status: 'READ' as const } : n
            )
          );
          this.unreadCount.update((c) => Math.max(0, c - 1));
        },
      });
    }

    // Navigate to relevant page based on reference type
    if (notification.referenceType === 'BILLING') {
      this.router.navigate(['/schoolAdmin/billings']);
    } else if (notification.referenceType === 'ENROLLMENT') {
      this.router.navigate(['/schoolAdmin/enrollments']);
    }

    this.showDropdown.set(false);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.update((list) =>
          list.map((n) => ({ ...n, status: 'READ' as const }))
        );
        this.unreadCount.set(0);
      },
    });
  }

  deleteAll(): void {
    this.notificationService.deleteAll().subscribe({
      next: () => {
        this.notifications.set([]);
        this.unreadCount.set(0);
      },
    });
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'PAYMENT_SUCCESS':
        return 'fa-solid fa-credit-card text-green-500';
      case 'ENROLLMENT_REQUEST':
        return 'fa-solid fa-user-plus text-blue-500';
      case 'ENROLLMENT_APPROVED':
        return 'fa-solid fa-circle-check text-green-500';
      case 'ENROLLMENT_REJECTED':
        return 'fa-solid fa-circle-xmark text-red-500';
      case 'INSTALLMENT_REMINDER':
        return 'fa-solid fa-clock text-amber-500';
      case 'INSTALLMENT_OVERDUE':
        return 'fa-solid fa-triangle-exclamation text-red-500';
      default:
        return 'fa-solid fa-bell text-gray-400';
    }
  }

  timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return 'À l\'instant';
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  }
}

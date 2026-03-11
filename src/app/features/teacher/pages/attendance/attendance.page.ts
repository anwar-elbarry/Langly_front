import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { TableComponent } from '../../../../shared/ui/table/table';
import { TeacherAttendanceService } from '../../services/teacher-attendance.service';
import { AttendanceResponse, QrCodeResponse } from '../../models/teacher.model';

@Component({
  selector: 'app-attendance-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SpinnerComponent, ButtonComponent, TableComponent],
  templateUrl: './attendance.page.html',
})
export class AttendancePage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private attendanceService = inject(TeacherAttendanceService);

  sessionId = '';
  loading = signal(true);
  attendanceList = signal<AttendanceResponse[]>([]);

  // QR state
  generatingQr = signal(false);
  qrToken = signal<string | null>(null);
  qrExpiresAt = signal<Date | null>(null);
  remainingSeconds = signal(0);

  private refreshInterval: ReturnType<typeof setInterval> | null = null;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.params['sessionId'];
    this.loadAttendance();
  }

  ngOnDestroy(): void {
    this.clearIntervals();
  }

  loadAttendance(): void {
    this.attendanceService
      .getAttendance(this.sessionId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (data) => this.attendanceList.set(data) });
  }

  generateQr(): void {
    this.generatingQr.set(true);
    this.attendanceService
      .generateQrCode(this.sessionId)
      .pipe(finalize(() => this.generatingQr.set(false)))
      .subscribe({
        next: (data: QrCodeResponse) => {
          this.qrToken.set(data.qrToken);
          this.qrExpiresAt.set(new Date(data.expiresAt));
          this.startCountdown();
          this.startAutoRefresh();
        },
      });
  }

  private startCountdown(): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.updateRemaining();
    this.countdownInterval = setInterval(() => {
      this.updateRemaining();
      if (this.remainingSeconds() <= 0) {
        this.qrToken.set(null);
        this.clearIntervals();
      }
    }, 1000);
  }

  private updateRemaining(): void {
    const expires = this.qrExpiresAt();
    if (!expires) {
      this.remainingSeconds.set(0);
      return;
    }
    const diff = Math.max(0, Math.floor((expires.getTime() - Date.now()) / 1000));
    this.remainingSeconds.set(diff);
  }

  private startAutoRefresh(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(() => {
      if (this.qrToken()) {
        this.attendanceService.getAttendance(this.sessionId).subscribe({
          next: (data) => this.attendanceList.set(data),
        });
      }
    }, 10000);
  }

  private clearIntervals(): void {
    if (this.refreshInterval) { clearInterval(this.refreshInterval); this.refreshInterval = null; }
    if (this.countdownInterval) { clearInterval(this.countdownInterval); this.countdownInterval = null; }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'PRESENT': return 'inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700';
      case 'LATE': return 'inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700';
      case 'ABSENT': return 'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700';
      case 'EXCUSED': return 'inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700';
      default: return 'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PRESENT': return 'Présent';
      case 'LATE': return 'En retard';
      case 'ABSENT': return 'Absent';
      case 'EXCUSED': return 'Excusé';
      default: return status;
    }
  }
}

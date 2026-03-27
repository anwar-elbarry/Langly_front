import { Component, inject, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { TeacherAttendanceService } from '../../services/teacher-attendance.service';
import { AttendanceResponse } from '../../models/teacher.model';

@Component({
  selector: 'app-attendance-page',
  imports: [RouterLink, SpinnerComponent, TableComponent],
  templateUrl: './attendance.page.html',
})
export class AttendancePage implements OnInit {
  private route = inject(ActivatedRoute);
  private attendanceService = inject(TeacherAttendanceService);
  private toast = inject(ToastService);

  constructor() {}

  sessionId = '';
  loading = signal(true);
  attendanceList = signal<AttendanceResponse[]>([]);

  // Manual marking state
  updatingStudentId = signal<string | null>(null);

  // Stats computed from attendance list
  stats = computed(() => {
    const list = this.attendanceList();
    return {
      total: list.length,
      present: list.filter(a => a.status === 'PRESENT').length,
      late: list.filter(a => a.status === 'LATE').length,
      absent: list.filter(a => a.status === 'ABSENT').length,
      excused: list.filter(a => a.status === 'EXCUSED').length,
      unmarked: list.filter(a => a.status === 'UNMARKED').length,
    };
  });

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.params['sessionId'];
    this.loadFullAttendance();
  }

  loadFullAttendance(): void {
    this.attendanceService
      .getFullAttendance(this.sessionId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (data) => this.attendanceList.set(data) });
  }

  markStudent(studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'): void {
    this.updatingStudentId.set(studentId);
    this.attendanceService
      .markManual(this.sessionId, { studentId, status })
      .pipe(finalize(() => this.updatingStudentId.set(null)))
      .subscribe({
        next: () => {
          this.toast.success('Présence mise à jour');
          this.loadFullAttendance();
        },
      });
  }

  markAllAs(status: 'PRESENT' | 'ABSENT'): void {
    const unmarked = this.attendanceList().filter(a => a.status === 'UNMARKED');
    if (unmarked.length === 0) return;
    let completed = 0;
    for (const record of unmarked) {
      this.attendanceService
        .markManual(this.sessionId, { studentId: record.studentId, status })
        .subscribe({
          next: () => {
            completed++;
            if (completed === unmarked.length) {
              this.toast.success(`${unmarked.length} élèves marqués comme ${status === 'PRESENT' ? 'présents' : 'absents'}`);
              this.loadFullAttendance();
            }
          },
        });
    }
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
      case 'UNMARKED': return 'Non marqué';
      default: return status;
    }
  }
}

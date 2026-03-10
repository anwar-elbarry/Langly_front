import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentAttendanceService } from '../../services/student-attendance.service';

@Component({
    selector: 'app-attendance',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './attendance.page.html',
})
export class AttendancePage {
    private attendanceService = inject(StudentAttendanceService);

    sessionId = signal('');
    qrToken = signal('');
    submitting = signal(false);
    success = signal('');
    error = signal('');

    markAttendance(): void {
        const sid = this.sessionId().trim();
        const token = this.qrToken().trim();

        if (!sid || !token) {
            this.error.set('Veuillez remplir tous les champs');
            return;
        }

        this.submitting.set(true);
        this.error.set('');
        this.success.set('');

        this.attendanceService.markAttendance({ sessionId: sid, qrToken: token }).subscribe({
            next: (res) => {
                this.success.set('Présence enregistrée avec succès !');
                this.submitting.set(false);
                this.sessionId.set('');
                this.qrToken.set('');
            },
            error: (err) => {
                const msg = err.error?.message || err.error || 'Erreur lors du marquage de la présence';
                this.error.set(typeof msg === 'string' ? msg : 'Erreur lors du marquage de la présence');
                this.submitting.set(false);
            },
        });
    }
}

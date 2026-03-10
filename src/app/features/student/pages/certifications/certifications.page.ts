import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CertificationService } from '../../services/certification.service';
import { CertificationResponse } from '../../models/student.model';

@Component({
    selector: 'app-certifications',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './certifications.page.html',
})
export class CertificationsPage implements OnInit {
    private certService = inject(CertificationService);

    certifications = signal<CertificationResponse[]>([]);
    loading = signal(true);

    ngOnInit(): void {
        this.certService.getMyCertifications().subscribe({
            next: (data) => {
                this.certifications.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false),
        });
    }

    downloadCert(cert: CertificationResponse): void {
        this.certService.downloadCertificate(cert.id).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `certificat_${cert.language}_${cert.level}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
        });
    }

    formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    }
}

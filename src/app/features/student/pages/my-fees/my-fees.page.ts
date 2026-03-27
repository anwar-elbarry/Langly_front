import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { StudentFeeStatusResponse } from '../../models/student.model';
import { StudentFeeService } from '../../services/student-fee.service';
import { feeTypeLabel } from '../../../admin/utils/status.utils';

@Component({
  selector: 'app-my-fees-page',
  imports: [CurrencyPipe, TableComponent, SpinnerComponent],
  templateUrl: './my-fees.page.html',
})
export class MyFeesPage implements OnInit {
  private feeService = inject(StudentFeeService);
  
  loading = signal(true);
  fees = signal<StudentFeeStatusResponse[]>([]);
  
  feeTypeLabel = feeTypeLabel;

  ngOnInit(): void {
    this.feeService.getMyFees()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.fees.set(data),
      });
  }

  getStatusBadgeClass(status: string): string {
    if (status === 'PAID') return 'inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700';
    if (status === 'PARTIALLY_PAID') return 'inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700';
    return 'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700';
  }

  getStatusLabel(status: string): string {
    if (status === 'PAID') return 'Payé';
    if (status === 'PARTIALLY_PAID') return 'Partiellement payé';
    return 'Non payé';
  }
}

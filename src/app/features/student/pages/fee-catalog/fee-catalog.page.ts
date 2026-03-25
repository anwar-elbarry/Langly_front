import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { StudentFeeCatalogResponse } from '../../models/student.model';
import { StudentFeeService } from '../../services/student-fee.service';
import { feeTypeLabel } from '../../../admin/utils/status.utils';

@Component({
  selector: 'app-fee-catalog-page',
  standalone: true,
  imports: [CommonModule, TableComponent, SpinnerComponent],
  templateUrl: './fee-catalog.page.html',
})
export class FeeCatalogPage implements OnInit {
  private feeService = inject(StudentFeeService);
  
  loading = signal(true);
  catalog = signal<StudentFeeCatalogResponse[]>([]);
  
  feeTypeLabel = feeTypeLabel;

  ngOnInit(): void {
    this.feeService.getCatalog()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.catalog.set(data),
      });
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { InvoiceResponse } from '../../models/billing-engine.model';
import { InvoiceStatus } from '../../models/enums';
import { InvoiceService } from '../../services/invoice.service';
import { invoiceStatusClass, invoiceStatusLabel } from '../../utils/status.utils';

type TabFilter = 'ALL' | InvoiceStatus;

@Component({
  selector: 'app-invoices-page',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    SpinnerComponent,
  ],
  templateUrl: './invoices.page.html',
})
export class InvoicesPage implements OnInit {
  private store = inject(Store);
  private invoiceService = inject(InvoiceService);
  private router = inject(Router);

  user = this.store.selectSignal(selectCurrentUser);
  loading = signal(true);
  allInvoices = signal<InvoiceResponse[]>([]);
  activeTab = signal<TabFilter>('ALL');

  invoiceStatusClass = invoiceStatusClass;
  invoiceStatusLabel = invoiceStatusLabel;

  tabs: { label: string; value: TabFilter }[] = [
    { label: 'Toutes', value: 'ALL' },
    { label: 'Non payées', value: 'UNPAID' },
    { label: 'Partiellement payées', value: 'PARTIALLY_PAID' },
    { label: 'Payées', value: 'PAID' },
  ];

  get filteredInvoices(): InvoiceResponse[] {
    const tab = this.activeTab();
    const all = this.allInvoices();
    if (tab === 'ALL') return all;
    return all.filter((inv) => inv.status === tab);
  }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;
    this.loading.set(true);
    this.invoiceService
      .getAllBySchool(schoolId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (data) => this.allInvoices.set(data) });
  }

  setTab(tab: TabFilter): void {
    this.activeTab.set(tab);
  }

  viewDetail(invoice: InvoiceResponse): void {
    this.router.navigate(['/schoolAdmin/invoices', invoice.id]);
  }
}

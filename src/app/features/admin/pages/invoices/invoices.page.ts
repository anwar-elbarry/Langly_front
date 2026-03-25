import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination';
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
  imports: [CommonModule, TableComponent, SpinnerComponent, PaginationComponent],
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
  searchQuery = signal('');
  currentPage = signal(0);
  pageSize = signal(10);

  invoiceStatusClass = invoiceStatusClass;
  invoiceStatusLabel = invoiceStatusLabel;

  tabs: { label: string; value: TabFilter }[] = [
    { label: 'Toutes', value: 'ALL' },
    { label: 'Non payées', value: 'UNPAID' },
    { label: 'Partiellement payées', value: 'PARTIALLY_PAID' },
    { label: 'Payées', value: 'PAID' },
  ];

  filteredInvoices = computed(() => {
    const tab = this.activeTab();
    let result = this.allInvoices();
    if (tab !== 'ALL') result = result.filter(inv => inv.status === tab);
    const q = this.searchQuery().toLowerCase();
    if (q) result = result.filter(inv =>
      inv.studentFullName.toLowerCase().includes(q) ||
      inv.invoiceNumber.toLowerCase().includes(q)
    );
    return result;
  });

  totalItems = computed(() => this.filteredInvoices().length);

  paginatedInvoices = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.filteredInvoices().slice(start, start + this.pageSize());
  });

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
    this.currentPage.set(0);
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.currentPage.set(0);
  }

  onPageChange(page: number) { this.currentPage.set(page); }
  onPageSizeChange(size: number) { this.pageSize.set(size); this.currentPage.set(0); }

  viewDetail(invoice: InvoiceResponse): void {
    this.router.navigate(['/schoolAdmin/invoices', invoice.id]);
  }
}

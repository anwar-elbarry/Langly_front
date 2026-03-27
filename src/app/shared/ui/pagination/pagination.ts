import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class PaginationComponent {
  currentPage = input(0);
  totalItems = input(0);
  pageSize = input(10);

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  readonly pageSizeOptions = [10, 20, 50];

  totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize())));

  startItem = computed(() => this.totalItems() === 0 ? 0 : this.currentPage() * this.pageSize() + 1);

  endItem = computed(() => Math.min((this.currentPage() + 1) * this.pageSize(), this.totalItems()));

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | '...')[] = [];

    if (total <= 7) {
      for (let i = 0; i < total; i++) pages.push(i);
      return pages;
    }

    pages.push(0);
    if (current > 2) pages.push('...');

    const start = Math.max(1, current - 1);
    const end = Math.min(total - 2, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 3) pages.push('...');
    pages.push(total - 1);

    return pages;
  });

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(size: number) {
    this.pageSizeChange.emit(size);
    this.pageChange.emit(0);
  }
}

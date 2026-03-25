import { Component, Output, EventEmitter, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FilterConfig {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

@Component({
  selector: 'app-search-filter-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-filter-bar.html',
  styleUrl: './search-filter-bar.css',
})
export class SearchFilterBarComponent {
  placeholder = input('Rechercher...');
  filters = input<FilterConfig[]>([]);
  showSearch = input(true);

  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<{ key: string; value: string }>();

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

  onFilterChange(key: string, event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filterChange.emit({ key, value });
  }
}

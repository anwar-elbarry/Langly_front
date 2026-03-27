import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class TableComponent {
  readonly striped = input(false);
  readonly hoverable = input(true);
  readonly compact = input(false);
}

import { Directive, EventEmitter, Input, Output } from "@angular/core";

// https://ng-bootstrap.github.io/#/components/table/examples

export type SortDirection = 'asc' | 'desc' | '';

export interface SortEvent {
  columnName: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: string = '';

  @Input() direction: SortDirection = '';

  @Input() descending?: string;

  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = this.advanceDirection();
    this.sort.emit({columnName: this.sortable, direction: this.direction});
  }

  private advanceDirection(): SortDirection {
    if (this.direction == 'asc') {
      return 'desc';
    }
    if (this.direction == 'desc') {
      return 'asc';
    }
    return ((this.descending === undefined) ? 'asc' : 'desc');
  }
}

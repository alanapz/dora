import { Directive, EventEmitter, Input, Output } from "@angular/core";
import { SortDirection, SortEvent } from "src/app/controls/table-sortable/table-sortable.types";

// https://ng-bootstrap.github.io/#/components/table/examples

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

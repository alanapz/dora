import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { QuickTableAction, QuickTableSelect } from "src/app/utils/quick-table-select";

@Component({
  selector: 'app-quick-table-select-row',
  templateUrl: './quick-table-select-row.component.html',
  styleUrls: ['./quick-table-select-row.component.css']
})
export class QuickTableSelectRowComponent extends AbstractComponent {

  @Input()
  qts?: QuickTableSelect<any>;

  @Input()
  item?: any;

  constructor(protected readonly injector: Injector) {
    super();
  }

  onClick(action: QuickTableAction<any>) {
    action.invokeSingle(this.item);
    return false;
  }
}

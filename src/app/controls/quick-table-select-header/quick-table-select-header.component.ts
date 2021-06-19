import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { QuickTableAction, QuickTableSelect } from "src/app/utils/quick-table-select";

@Component({
  selector: 'app-quick-table-select-header',
  templateUrl: './quick-table-select-header.component.html',
  styleUrls: ['./quick-table-select-header.component.css']
})
export class QuickTableSelectHeaderComponent extends AbstractComponent {

  @Input()
  qts?: QuickTableSelect<any>;

  constructor(protected readonly injector: Injector) {
    super();
  }

  onClick(action: QuickTableAction<any>) {
    action.invokeAll();
    return false;
  }
}

import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { QuickTableSelect } from "src/app/utils/quick-table-select";

@Component({
  selector: 'app-repository-details-untracked',
  templateUrl: './repository-details-untracked.component.html'
})
export class RepositoryDetailsUntrackedComponent extends AbstractComponent {

  @Input()
  untrackedFiles: {path: string, selected?: boolean}[] = [];

  readonly qts = new QuickTableSelect(this, () => this.untrackedFiles);

  constructor(protected readonly injector: Injector) {
    super();
  }
}

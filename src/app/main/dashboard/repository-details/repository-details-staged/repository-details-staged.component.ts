import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { QuickTableSelect } from "src/app/utils/quick-table-select";
import { GitWorkingDirectoryItemStatus } from "src/generated/graphql";

@Component({
  selector: 'app-repository-details-staged',
  templateUrl: './repository-details-staged.component.html'
})
export class RepositoryDetailsStagedComponent extends AbstractComponent {

  @Input()
  stagedFiles: {path: string, status: GitWorkingDirectoryItemStatus[], selected?: boolean}[] = [];

  readonly qts = new QuickTableSelect(() => this.stagedFiles);

  constructor(protected readonly injector: Injector) {
    super();
  }
}

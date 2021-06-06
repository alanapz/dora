import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { QuickTableSelect } from "src/app/utils/quick-table-select";
import { GitWorkingDirectoryItemStatus } from "src/generated/graphql";

@Component({
  selector: 'app-repository-details-unstaged',
  templateUrl: './repository-details-unstaged.component.html'
})
export class RepositoryDetailsUnstagedComponent extends AbstractComponent {

  @Input()
  unstagedFiles: {path: string, status: GitWorkingDirectoryItemStatus[], selected?: boolean}[] = [];

  readonly qts = new QuickTableSelect(() => this.unstagedFiles);

  constructor(protected readonly injector: Injector) {
    super();
  }
}

import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { QuickTableSelect } from "src/app/utils/quick-table-select";
import { GitRepository, GitWorkingDirectoryItem } from "src/generated/graphql";
import { utils } from "src/utils/utils";

@Component({
  selector: 'app-repository-details-staged',
  templateUrl: './repository-details-staged.component.html'
})
export class RepositoryDetailsStagedComponent extends AbstractComponent {

  @Input("repo")
  _repo?: GitRepository;

  readonly qts = new QuickTableSelect(() => this.stagedFiles);

  constructor(protected readonly injector: Injector) {
    super();
  }

  get stagedFiles(): GitWorkingDirectoryItem[] {
    const stagedFiles = [... (this._repo!.workingDirectory && this._repo!.workingDirectory.staged) ?? []];
    stagedFiles.sort(utils.orderBy({func: val => val.path}));
    return stagedFiles;
  }
}

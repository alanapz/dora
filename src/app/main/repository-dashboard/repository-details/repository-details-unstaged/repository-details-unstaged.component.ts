import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { QuickTableSelect } from "src/app/utils/quick-table-select";
import { GitRepository, GitWorkingDirectoryItem } from "src/generated/graphql";
import { utils } from "src/utils/utils";

@Component({
  selector: 'app-repository-details-unstaged',
  templateUrl: './repository-details-unstaged.component.html'
})
export class RepositoryDetailsUnstagedComponent extends AbstractComponent {

  @Input("repo")
  _repo?: GitRepository;

  readonly qts = new QuickTableSelect(() => this.unstagedFiles);

  constructor(protected readonly injector: Injector) {
    super();
  }

  get unstagedFiles(): GitWorkingDirectoryItem[] {
    const unstagedFiles = [... (this._repo!.workingDirectory && this._repo!.workingDirectory.unstaged) ?? []];
    unstagedFiles.sort(utils.orderBy({func: val => val.path}));
    return unstagedFiles;
  }
}

import { Component, Injector, Input, QueryList, ViewChildren } from '@angular/core';
import moment from "moment";
import { AbstractComponent } from "src/app/abstract-component";
import { NgbdSortableHeader, SortEvent } from "src/app/directives/table-sortable/table-sortable.directive";
import { QuickTableSelect } from "src/app/utils/quick-table-select";
import { GitRepository, GitStash } from "src/generated/graphql";
import { SortCallback, utils } from "src/utils/utils";

declare type StashesTableSortKey = 'name' | 'date';

@Component({
  selector: 'app-repository-details-stashes',
  templateUrl: './repository-details-stashes.component.html'
})
export class RepositoryDetailsStashesComponent extends AbstractComponent {

  @Input("repo")
  _repo?: GitRepository;

  @ViewChildren(NgbdSortableHeader)
  _tableHeaders?: QueryList<NgbdSortableHeader>;

  readonly qts = new QuickTableSelect(this, () => this.stashes);

  // Sort by name by default
  private _sortCallback: SortCallback<GitStash> = { func: stash => stash.displayName };

  constructor(protected readonly injector: Injector) {
    super();
  }

  get stashes(): GitStash[] {
    const stashes = [... this._repo!.stashes];
    stashes.sort(utils.orderBy(this._sortCallback));
    return stashes;
  }

  get repoPath() {
    return this._repo!.path;
  }

  propName(prop: StashesTableSortKey): string {
    return prop;
  }

  onSort({columnName, direction}: SortEvent): void {

    this._tableHeaders!.forEach(header => {
      if (header.sortable !== columnName) {
        header.direction = '';
      }
    });

    const sortKey = columnName as StashesTableSortKey;
    const descending = ((direction == 'desc'));

    if (sortKey === 'name') {
      this._sortCallback = { func: branch => branch.displayName, descending };
    }
  }

  numberOfDays(stash: GitStash) {
    return (moment().unix() - stash.timestamp) / 60 / 60 / 24;
  }
}

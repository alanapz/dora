import { Component, Injector, Input, QueryList, ViewChildren } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { NgbdSortableHeader } from "src/app/controls/table-sortable/table-sortable.directive";
import { SortEvent } from "src/app/controls/table-sortable/table-sortable.types";
import { QuickTableSelect } from "src/app/utils/quick-table-select";
import { GitBranch, GitRepository } from "src/generated/graphql";
import { SortCallback, utils } from "src/utils/utils";

declare type BranchesTableSortKey = 'name' | 'date' | 'upstream' | 'upstreamAhead' | 'upstreamBehind';

@Component({
  selector: 'app-repository-details-branches',
  templateUrl: './repository-details-branches.component.html',
  styleUrls: ['./repository-details-branches.component.css']
})
export class RepositoryDetailsBranchesComponent extends AbstractComponent {

  @Input("repo")
  _repo?: GitRepository;

  @ViewChildren(NgbdSortableHeader)
  _tableHeaders?: QueryList<NgbdSortableHeader>;

  readonly qts = new QuickTableSelect(() => this.branches);

  // Sort by name by default
  private _sortCallback: SortCallback<GitBranch> = { func: branch => branch.displayName };

  constructor(protected readonly injector: Injector) {
    super();
  }

  get branches(): GitBranch[] {
    const branches = [... this._repo!.branches];
    branches.sort(utils.orderBy(this._sortCallback));
    return branches;
  }

  get repoPath() {
    return this._repo!.path;
  }

  propName(prop: BranchesTableSortKey): string {
    return prop;
  }

  onSort({columnName, direction}: SortEvent): void {

    this._tableHeaders!.forEach(header => {
      if (header.sortable !== columnName) {
        header.direction = '';
      }
    });

    const sortKey = columnName as BranchesTableSortKey;
    const descending = ((direction == 'desc'));

    if (sortKey === 'name') {
      this._sortCallback = { func: branch => branch.displayName, descending };
    }
    else if (sortKey === 'date') {
      this._sortCallback = { func: branch => branch.commit.committer.timestamp, descending };
    }
    else if (sortKey === 'upstream') {
      this._sortCallback = { func: branch => !!branch.upstream, descending };
    }
    else if (sortKey === 'upstreamAhead') {
      this._sortCallback = { func: branch => branch.upstreamDistance?.ahead || 0, descending };
    }
    else if (sortKey === 'upstreamBehind') {
      this._sortCallback = { func: branch => branch.upstreamDistance?.behind || 0, descending };
    }
  }
}

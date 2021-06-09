import { Component, Injector, Input, QueryList, ViewChildren } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { NgbdSortableHeader, SortEvent } from "src/app/directives/table-sortable/table-sortable.directive";
import { QuickTableSelect } from "src/app/utils/quick-table-select";
import { GitBranch, GitRepository } from "src/generated/graphql";
import { SortCallback, utils } from "src/utils/utils";

declare type BranchesTableSortKey = 'name' | 'date' | 'upstream' | 'upstreamAhead' | 'upstreamBehind' | 'parent' | 'parentAhead' | 'parentBehind';

@Component({
  selector: 'app-repository-details-branches-summary',
  templateUrl: './repository-details-branches-summary.component.html',
  styleUrls: ['./repository-details-branches-summary.component.css']
})
export class RepositoryDetailsBranchesSummaryComponent extends AbstractComponent {

  @Input("repo")
  _repo?: GitRepository;

  @ViewChildren(NgbdSortableHeader)
  _tableHeaders?: QueryList<NgbdSortableHeader>;

  readonly qts = new QuickTableSelect(this, () => this.branches);

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
      this._sortCallback = { func: branch => branch.upstream?.displayName, descending };
    }
    else if (sortKey === 'upstreamAhead') {
      this._sortCallback = { func: branch => branch.upstreamDistance?.ahead || 0, descending };
    }
    else if (sortKey === 'upstreamBehind') {
      this._sortCallback = { func: branch => branch.upstreamDistance?.behind || 0, descending };
    }
    else if (sortKey === 'parent') {
      this._sortCallback = { func: branch => branch.upstream?.parent?.displayName, descending };
    }
    else if (sortKey === 'parentAhead') {
      this._sortCallback = { func: branch => branch.upstream?.parentDistance?.ahead || 0, descending };
    }
    else if (sortKey === 'parentBehind') {
      this._sortCallback = { func: branch => branch.upstream?.parentDistance?.behind || 0, descending };
    }
  }

  resolveStatus(branch: GitBranch) {
    if (branch.upstream && branch.upstream.isTrunk) {
      return "Trunk branch";
    }
    if (!branch.upstream || !branch.upstreamDistance) {
      return "No upstream - push required ";
    }
    if (branch.upstreamDistance.ahead > 0 && branch.upstreamDistance.behind > 0) {
      return "Upstream diverged - rebase required ?";
    }
    if (branch.upstreamDistance.ahead > 0) {
      return "Ahead of upstream - push required ?";
    }
    if (branch.upstreamDistance.behind > 0) {
      return "Behind upstream - pull required ?";
    }
    if (!branch.upstream.parent || !branch.upstream.parentDistance) {
      return "Error resolving parent";
    }
    if (branch.upstream.parentDistance.ahead > 0) {
      return "Ahead of parent - merge required";
    }
    if (branch.upstream.parentDistance.ahead > 0) {
      return "Behind parent - rebase parent into branch";
    }
    return "Upto date";
  }
}

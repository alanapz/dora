import { Component, Injector, QueryList, ViewChildren } from '@angular/core';
import { gql, OperationVariables } from "@apollo/client/core";
import { DocumentNode } from "graphql";
import { EMPTY, Observable } from "rxjs";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { AbstractComponent } from "src/app/abstract-component";
import { NgbdSortableHeader, SortEvent } from "src/app/directives/table-sortable/table-sortable.directive";
import { GraphQLService } from "src/app/services/graphql.service";
import { RepositoryService } from "src/app/services/repository.service";
import { ToastService } from "src/app/services/toast-service";
import { QuickTableSelect } from "src/app/utils/quick-table-select";
import { environment } from "src/environments/environment";
import { GitBranch, GitRepository } from "src/generated/graphql";
import { multiFork } from "src/utils/multifork";
import { SortCallback, utils } from "src/utils/utils";

interface RepositoryListItem {
  path: string;
  loaded: boolean;
  busy: boolean;
}

type BranchSortKey = 'path'
  | 'name'
  | 'date'
  | 'author'
  | 'message'
  | 'upstream'
  | 'upstreamAhead'
  | 'upstreamBehind'
  | 'parent'
  | 'parentAhead'
  | 'parentBehind';

@Component({
  selector: 'app-branches-list',
  templateUrl: './branches-list.component.html',
  styleUrls: ['./branches-list.component.css']
})
export class BranchesListComponent extends AbstractComponent {

  @ViewChildren(NgbdSortableHeader)
  _tableHeaders?: QueryList<NgbdSortableHeader>;

  filterBy: string = '';

  private _repositories: RepositoryListItem[] = [];

  private _branches: GitBranch[] = [];

  private _sortCallback: SortCallback<GitBranch> = { func: branch => branch.displayName };

  readonly qts = new QuickTableSelect(() => this.branches)
    .addAction({
      label: "Push ### branches to upstream (fast-forward only)",
      icon: 'bi-box-arrow-right',
      // We can push if have an upstream, we are ahead, but not behind
      enabled: branch => !branch.upstream || (branch.upstreamDistance && branch.upstreamDistance.ahead > 0 && branch.upstreamDistance.behind === 0),
    })
    .addAction({
      label: "Pull ### branches from parent (fast-forward only)",
      icon: 'bi-box-arrow-in-right',
      // We can pull if have a parent, we are behind, and are not ahead
      enabled: branch => (branch.parentDistance && branch.parentDistance.ahead === 0 && branch.parentDistance.behind > 0)
    })
    .addAction({
      label: "Delete ### merged branches",
      type: 'danger',
      icon: 'bi-trash-fill',
      // We can delete if have a parent and we are not ahead (fully merged)
      enabled: branch => (branch.parentDistance && branch.parentDistance.ahead === 0),
      invoker: branch => this.deleteBranch(branch)
    });

  constructor(
    protected readonly injector: Injector,
    private readonly graphql: GraphQLService,
    private readonly repositoryService: RepositoryService,
    private readonly toastService: ToastService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadRepositories();
  }

  private loadRepositories(): void {

    const waitComplete = this.incrementWaitCount();

    const query: DocumentNode = gql`
      query {
        results: searchRepositories { path }
      }
    `;

    this.graphql.query<{ results: GitRepository[] }>({query})
      .pipe(map(result => result.results))
      .subscribe(utils.subscriber(results => {

        this._repositories = results.map(repo => ({path: repo.path, loaded: false, busy: false }));
        this._branches = [];

        multiFork(environment.concurrency, this._repositories
          .map(repo => this.loadRepository(repo)))
          .subscribe(utils.subscriber());

        waitComplete();
      }));
  }

  private loadRepository(repository: RepositoryListItem): Observable<void> {

    const query: DocumentNode = gql`
      query getBranchesForRepo($repoPath: String!) {
        result: repository(path: $repoPath) {
          branches {
            repository {
              path
              hostPath
              webUrls { remote { name }, url }
            }
            refName, displayName, branchName
            commit {
              id
              subject
              message
              committer { name, emailAddress, timestamp }
              author { name, emailAddress, timestamp }
              webUrls { remote { name }, url }
            }
            isTrunk
            parent {
              refName, displayName, branchName
              remote { name }
              webUrl { remote { name }, url }
            }
            parentDistance { ahead, behind }
            upstream {
              refName, displayName, branchName
              remote { name }
              webUrl { remote { name }, url }
            },
            upstreamDistance { ahead, behind }
          }
        }
      }
    `;

    const variables: OperationVariables = {
      repoPath: repository.path
    };

    return this.graphql.query<{ result: GitRepository }>({query, variables})
      .pipe(map(result => result.result))
      .pipe(mergeMap(result => {

        // Remove all existing branches belonging to this repo
        utils.removeIf(this._branches, branch => branch.repository.path === repository.path);

        this._branches.push(... result.branches);

        repository.loaded = true;
        repository.busy = false;

        return utils.ofVoid();
      }));
  }

  get repositories(): RepositoryListItem[] {
    return this._repositories;
  }

  get allRepositoriesLoaded(): boolean {
    return this._repositories.every(repo => repo.loaded);
  }

  get branches(): GitBranch[] {
    return this._branches
      .filter(branch => utils.contains(this.filterBy, branch.displayName, branch.commit.author.name, branch.commit.message))
      .sort(utils.orderBy(this._sortCallback));
  }

  propName(prop: BranchSortKey): string {
    return prop;
  }

  onSort({columnName, direction}: SortEvent): void {

    this._tableHeaders!.forEach(header => {
      if (header.sortable !== columnName) {
        header.direction = '';
      }
    });

    const sortKey = columnName as BranchSortKey;
    const descending = ((direction == 'desc'));

    if (sortKey === 'path') {
      this._sortCallback = { func: branch => branch.repository.path, descending };
    }
    else if (sortKey === 'name') {
      this._sortCallback = { func: branch => branch.displayName, descending };
    }
    else if (sortKey === 'date') {
      this._sortCallback = { func: branch => branch.commit.committer.timestamp, descending };
    }
    else if (sortKey === 'author') {
      this._sortCallback = { func: branch => branch.commit.author.name, descending };
    }
    else if (sortKey === 'message') {
      this._sortCallback = { func: branch => branch.commit.subject, descending };
    }
    else if (sortKey === 'upstream') {
      this._sortCallback = { func: branch => branch.upstream?.displayName, descending };
    }
    else if (sortKey === 'upstreamAhead') {
      this._sortCallback = { func: branch => branch.upstreamDistance?.ahead || -1, descending };
    }
    else if (sortKey === 'upstreamBehind') {
      this._sortCallback = { func: branch => branch.upstreamDistance?.behind || -1, descending };
    }
    else if (sortKey === 'parent') {
      this._sortCallback = { func: branch => branch.parent?.displayName, descending };
    }
    else if (sortKey === 'parentAhead') {
      this._sortCallback = { func: branch => branch.parentDistance?.ahead || -1, descending };
    }
    else if (sortKey === 'parentBehind') {
      this._sortCallback = { func: branch => branch.parentDistance?.behind || -1, descending };
    }
  }

  onRefreshClicked() {
    this.loadRepositories();
    return false;
  }

  onFetchAllClicked() {
    multiFork(environment.concurrency, this._repositories.map(repo => this.fetchAndReloadRepository(repo))).subscribe(utils.subscriber());
    return false;
  }

  private fetchAndReloadRepository(repository: RepositoryListItem): Observable<void> {
    repository.loaded = false;
    repository.busy = true;
    return this.repositoryService.fetchRepository(repository.path)
      .pipe(tap(() => repository.busy = false))
      .pipe(catchError(e => {
        this.toastService.showError(`'${repository.path}': ${e}`);
        return utils.ofVoid();
      }))
      .pipe(mergeMap(() => this.loadRepository(repository)));
  }

  private deleteBranch(branch: GitBranch): Observable<void> {
    const repository = this._repositories.find(repo => repo.path === branch.repository.path);

    if (!repository) {
      return EMPTY;
    }

    repository.loaded = false;
    repository.busy = true;

    const mutation = gql`
      mutation deleteBranch($repoPath: String!, $branchName: String!) {
        repository(path: $repoPath) {
          branch(name: $branchName) {
            delete
          }
        }
      }
    `;

    const variables = { repoPath: repository.path, branchName: branch.branchName };

    return this.graphql.mutate({mutation, variables})
      .pipe(tap(() => repository.busy = false))
      .pipe(tap(() => this.toastService.showSuccess(`'${branch.branchName}' on '${repository.path}' deleted`)))
      .pipe(catchError(e => {
        this.toastService.showError(`'${repository.path}': ${e}`);
        return utils.ofVoid();
      }))
      .pipe(mergeMap(() => this.loadRepository(repository)));
  }

/*
  onBulkAction(action: 'fetch' | 'setDefaultUpstream') {

    const selectedRepositories = this._repositories.filter(repo => this.qts.selected.has(repo) && !repo.filtered);

    multiFork(environment.concurrency, selectedRepositories.map(repo => this.fetchAndReloadRepository(repo)))
      .subscribe(utils.subscriber());
  }

  onAction(repo: RepositoryListItem, action: 'fetch') {
    this.fetchAndReloadRepository(repo).subscribe(utils.subscriber());
  }

  private fetchAndReloadRepository(repo: RepositoryListItem): Observable<void> {
    repo.busy = true;
    repo.loaded = false;
    return this.repositoryService.fetchRepository(repo.path)
      .pipe(tap(() => repo.busy = false))
      .pipe(catchError(e => {
        this.toastService.showError(`'${repo.path}' error: ${e}`);
        return utils.ofVoid();
      }))
      .pipe(mergeMap(() => this.loadRepository(repo)));
  }*/
}

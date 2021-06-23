import { Component, Injector, Input, QueryList, ViewChildren } from '@angular/core';
import { gql, OperationVariables } from "@apollo/client/core";
import { Observable, of, Subject } from "rxjs";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { AbstractComponent } from "src/app/abstract-component";
import { NgbdSortableHeader, SortEvent } from "src/app/directives/table-sortable/table-sortable.directive";
import {
  RepositoryModifiedEvent,
  RepositorySelectedEvent,
  RepositorySelectionType
} from "src/app/main/repository-dashboard";
import { GraphQLService } from "src/app/services/graphql.service";
import { RepositoryService } from "src/app/services/repository.service";
import { ToastService } from "src/app/services/toast-service";
import { QuickTableSelect } from "src/app/utils/quick-table-select";
import { environment } from "src/environments/environment";
import { GitRepository, GitWebUrl } from "src/generated/graphql";
import { nonNull } from "src/utils/check";
import { multiFork } from "src/utils/multifork";
import { SortCallback, utils } from "src/utils/utils";

interface RepositoryListItem {
  path: string;
  loaded: boolean;
  busy: boolean;
  lastFetchDate: number | null;
  lastCommitDate: number | null;
  lastCommitWebUrls: GitWebUrl[] | null;
  staged: number | null;
  unstaged: number | null;
  untracked: number | null;
  headRefName: string | null;
  headDisplayName: string | null;
  branches: number | null;
  branchesWithNoUpstream: number | null;
  branchesAheadOfUpstream: number | null;
  branchesBehindUpstream: number | null;
  branchesAheadOfAndBehindUpstream: number | null;
  branchesAheadOfParent: number | null;
  branchesBehindParent: number | null;
  branchesAheadOfAndBehindParent: number | null;
  stashes: number | null;
  warnings: number | null;
  webUrls: GitWebUrl[] | null;
}

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.css']
})
export class RepositoryListComponent extends AbstractComponent {

  @Input()
  fullScreenMode?: boolean;

  @Input()
  repositorySelected?: Subject<RepositorySelectedEvent|null>;

  @Input()
  repositoryModified?: Subject<RepositoryModifiedEvent>;

  @ViewChildren(NgbdSortableHeader)
  repositoryTableHeaders?: QueryList<NgbdSortableHeader>;

  filterBy: string = '';

  private _repositories: RepositoryListItem[] = [];

  private _sortCallback: SortCallback<RepositoryListItem> = { func: repo => repo.path };

  readonly qts = new QuickTableSelect(() => this.repositories)
    .addAction({
      label: "Fetch selected (###)",
      icon: 'bi-download',
      invoker: repo => this.fetchAndReloadRepository(repo)
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

    nonNull(this.fullScreenMode, "fullScreenMode");
    nonNull(this.repositorySelected, "repositorySelected");
    nonNull(this.repositoryModified, "repositoryModified");

    this.repositoryModified!
      .pipe(this.untilDestroyed())
      .pipe(mergeMap(event => {
        const repository = this._repositories.find(r => r.path === event.path);
        return (repository ? this.loadRepository(repository) : of(void 0));
      }))
      .subscribe(utils.subscriber());

    this.loadRepositories();
  }

  private loadRepositories(): void {

    const waitComplete = this.incrementWaitCount();

    const query = gql`
      query {
        results: searchRepositories { path }
      }
    `;

    this.graphql.query<{ results: GitRepository[] }>({query})
      .pipe(map(response => response.results))
      .subscribe(utils.subscriber(results => {

        this._repositories = results.map(repo => ({
          path: repo.path,
          loaded: false,
          busy: false,
          lastFetchDate: null,
          lastCommitDate: null,
          lastCommitWebUrls: null,
          staged: null,
          unstaged: null,
          untracked: null,
          headRefName: null,
          headDisplayName: null,
          branches: null,
          branchesWithNoUpstream: null,
          branchesAheadOfUpstream: null,
          branchesBehindUpstream: null,
          branchesAheadOfAndBehindUpstream: null,
          branchesWithNoParent: null,
          branchesAheadOfParent: null,
          branchesBehindParent: null,
          branchesAheadOfAndBehindParent: null,
          stashes: null,
          unpushedTags: null,
          warnings: null,
          webUrls: null
        }));

        multiFork(environment.concurrency, this._repositories
          .map(repo => this.loadRepository(repo)))
          .subscribe(utils.subscriber());

        this.onSort({columnName: this.propName("path"), direction: "asc"});

        waitComplete();
      }));
  }

  private loadRepository(repository: RepositoryListItem): Observable<void> {

    const query = gql`
      query getRepoDetails($repoPath: String!) {
        result: repository(path: $repoPath) {
          path,
          lastFetchDate
          recentCommits(count: 1) {
            id
            committer { timestamp }
            webUrls { remote { name }, url }
          },
          workingDirectory {
            stagedLength
            unstagedLength
            untrackedLength
          },
          head {
            refName
            displayName
          },
          branches {
            branchName
            upstream {
              branchName
              parent { branchName }
              parentDistance { ahead, behind }
            },
            upstreamDistance { ahead, behind }
          },
          stashes {
            refName
          }
          webUrls { remote { name }, url }
        }
      }
    `;

    const variables: OperationVariables = {
      repoPath: repository.path
    };

    return this.graphql.query<{ result: GitRepository }>({query, variables})
      .pipe(map(result => result.result))
      .pipe(mergeMap(result => {

        const workingDirectory = nonNull(result.workingDirectory);

        const upstreamDistances = result.branches.filter(b => !!b.upstreamDistance).map(b => b.upstreamDistance!);
        const parentDistances = result.branches.filter(b => b.upstream?.parentDistance).map(b => b.upstream!.parentDistance!);

        repository.loaded = true;
        repository.busy = false;
        repository.lastFetchDate = (result.lastFetchDate || null);
        repository.lastCommitDate = (result.recentCommits && result.recentCommits.length ? result.recentCommits[0].committer.timestamp : null);
        repository.lastCommitWebUrls = (result.recentCommits && result.recentCommits.length ? result.recentCommits[0].webUrls : null);
        repository.staged = (workingDirectory?.stagedLength || null);
        repository.unstaged = (workingDirectory?.unstagedLength || null);
        repository.untracked = (workingDirectory?.untrackedLength || null);
        repository.headRefName = (result.head?.refName || null);
        repository.headDisplayName = (result.head?.displayName || null);
        repository.branches = result.branches.length;
        repository.branchesWithNoUpstream = result.branches.filter(b => !b.upstreamDistance).length;
        repository.branchesAheadOfUpstream = upstreamDistances.filter(ud => ud.ahead > 0 && ud.behind === 0).length;
        repository.branchesBehindUpstream = upstreamDistances.filter(ud => ud.ahead === 0 && ud.behind > 0).length;
        repository.branchesAheadOfAndBehindUpstream = upstreamDistances.filter(ud => ud.ahead > 0 && ud.behind > 0).length;

        repository.branchesAheadOfParent = parentDistances.filter(pd => pd.ahead > 0 && pd.behind === 0).length;
        repository.branchesBehindParent = parentDistances.filter(pd => pd.ahead === 0 && pd.behind > 0).length;
        repository.branchesAheadOfAndBehindParent = parentDistances.filter(pd => pd.ahead > 0 && pd.behind > 0).length;

        repository.stashes = result.stashes.length;
        repository.warnings = 0;
        repository.webUrls = result.webUrls;

        return of(void 0);
      }));
  }

  get repositories(): RepositoryListItem[] {
    return this._repositories
      .filter(repo => utils.contains(this.filterBy, repo.path, repo.headDisplayName))
      .sort(utils.orderBy(this._sortCallback));
  }

  propName(prop: keyof RepositoryListItem): string {
    return prop;
  }

  onRefreshClicked() {
    this.loadRepositories();
    return false;
  }

  onFetchAllClicked() {
    multiFork(environment.concurrency, this._repositories.map(repo => this.fetchAndReloadRepository(repo))).subscribe(utils.subscriber());
    return false;
  }

  onClick(repository: RepositoryListItem, selectionType: RepositorySelectionType) {
    this.repositorySelected!.next({path: repository.path, selectionType});
    return false;
  }

  onSort({columnName, direction}: SortEvent): void {

    this.repositoryTableHeaders!.forEach(header => {
      if (header.sortable !== columnName) {
        header.direction = '';
      }
    });

    this._sortCallback = {
      func: (status) => status[(columnName as keyof RepositoryListItem)],
      descending: (direction == 'desc')
    };
  }

  onAction(repo: RepositoryListItem, action: 'fetch') {
    this.fetchAndReloadRepository(repo).subscribe(utils.subscriber());
  }

  onBulkAction(action: 'fetch') {
    multiFork(environment.concurrency, this.qts.selected.map(repo => this.fetchAndReloadRepository(repo))).subscribe(utils.subscriber());
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
  }
}

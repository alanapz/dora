import { Component, Injector, Input, QueryList, ViewChildren } from '@angular/core';
import { gql, OperationVariables } from "@apollo/client/core";
import { Apollo } from "apollo-angular";
import { DocumentNode } from "graphql";
import { Observable, of, Subject } from "rxjs";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { AbstractComponent } from "src/app/abstract-component";
import { NgbdSortableHeader } from "src/app/controls/table-sortable/table-sortable.directive";
import { SortEvent } from "src/app/controls/table-sortable/table-sortable.types";
import {
  RepositoryModifiedEvent,
  RepositorySelectedEvent,
  RepositorySelectionType
} from "src/app/main/dashboard/dashboard.types";
import { RepositoryService } from "src/app/services/repository.service";
import { ToastService } from "src/app/services/toast-service";
import { unwrapApolloResult } from "src/app/utils/gql-result.operator";
import { QuickTableSelect } from "src/app/utils/quick-table-select";
import { environment } from "src/environments/environment";
import { GitRepository } from "src/generated/graphql";
import { nonNull } from "src/utils/check";
import { multiFork } from "src/utils/multifork";
import { utils } from "src/utils/utils";

interface RepositoryListItem {
  path: string;
  loaded: boolean;
  busy: boolean;
  filtered: boolean;
  lastFetchDate: number | null;
  lastCommitDate: number | null;
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
  branchesWithNoParent: number | null;
  branchesAheadOfParent: number | null;
  branchesBehindParent: number | null;
  branchesAheadOfAndBehindParent: number | null;
  stashes: number | null;
  warnings: number | null;
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

  readonly qts = new QuickTableSelect(() => this.repositories);

  private _repositories: RepositoryListItem[] = [];

  constructor(
    protected readonly injector: Injector,
    private readonly apollo: Apollo,
    private readonly repositoryService: RepositoryService,
    private readonly toastService: ToastService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();

    nonNull(this.fullScreenMode, "fullScreenMode");
    nonNull(this.repositorySelected, "repositorySelected");
    nonNull(this.repositoryModified, "repositoryModified");

    const waitComplete = this.incrementWaitCount();

    this.repositoryModified!
      .pipe(this.untilDestroyed())
      .pipe(mergeMap(event => {
        const repository = this._repositories.find(r => r.path === event.path);
        return (repository ? this.loadRepository(repository) : of(void 0));
      }))
      .subscribe(utils.subscriber());

    const query: DocumentNode = gql`
      query {
        results: searchRepositories { path }
      }
    `;

    this.apollo.query<{ results: GitRepository[] }>({query})
      .pipe(unwrapApolloResult())
      .subscribe(utils.subscriber(response => {

        this._repositories = response.results.map(repo => ({
          path: repo.path,
          loaded: false,
          busy: false,
          filtered: false,
          lastFetchDate: null,
          lastCommitDate: null,
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
        }));

        multiFork(environment.concurrency, this._repositories
          .map(repo => this.loadRepository(repo)))
          .subscribe(utils.subscriber());

        this.onSort({columnName: this.propName("path"), direction: "asc"});

        waitComplete();
      }));
  }

  private loadRepository(repository: RepositoryListItem): Observable<void> {

    const query: DocumentNode = gql`
      query getRepoDetails($repoPath: String!) {
        result: repository(path: $repoPath) {
          path,
          lastFetchDate,
          recentCommits(count: 1) {
            id,
            committer { timestamp }
          },
          workingDirectory {
            staged { status },
            unstaged { status },
            untracked { status }
          },
          head {
            refName,
            displayName
          },
          branches {
            branchName,
            upstream { branchName },
            upstreamDistance { ahead, behind }
          },
          stashes {
            refName
          }
        }
      }
    `;

    const variables: OperationVariables = {
      repoPath: repository.path
    };

    return this.apollo.query<{ result: GitRepository }>({query, variables}).pipe(
      unwrapApolloResult(),
      map(result => result.result),
      mergeMap(result => {

        const workingDirectory = nonNull(result.workingDirectory);
        const upstreamDistances = result.branches.filter(b => !!b.upstreamDistance).map(b => b.upstreamDistance!);

        repository.loaded = true;
        repository.busy = false;
        repository.lastFetchDate = (result.lastFetchDate || null);
        repository.lastCommitDate = (result.recentCommits && result.recentCommits.length ? result.recentCommits[0].committer.timestamp : null);
        repository.staged = workingDirectory.staged.length;
        repository.unstaged = workingDirectory.unstaged.length;
        repository.untracked = workingDirectory.untracked.length;
        repository.headRefName = (result.head?.refName || null);
        repository.headDisplayName = (result.head?.displayName || null);
        repository.branches = result.branches.length;
        repository.branchesWithNoUpstream = result.branches.filter(b => !b.upstreamDistance).length;
        repository.branchesAheadOfUpstream = upstreamDistances.filter(ud => ud.ahead > 0 && ud.behind === 0).length;
        repository.branchesBehindUpstream = upstreamDistances.filter(ud => ud.ahead === 0 && ud.behind > 0).length;
        repository.branchesAheadOfAndBehindUpstream = upstreamDistances.filter(ud => ud.ahead > 0 && ud.behind > 0).length;
        repository.stashes = result.stashes.length;
        repository.warnings = 0;

        return of(void 0);
      }));
  }

  get repositories(): RepositoryListItem[] {
    return this._repositories;
  }

  propName(prop: keyof RepositoryListItem): string {
    return prop;
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

    this._repositories.sort(utils.orderBy(({
      func: (status) => status[(columnName as keyof RepositoryListItem)],
      descending: (direction == 'desc')
    })));
  }

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
  }
}

import { Component, Injector, Input, QueryList, ViewChildren } from '@angular/core';
import { gql, OperationVariables } from "@apollo/client/core";
import { Apollo } from "apollo-angular";
import { DocumentNode } from "graphql";
import { Observable, of, Subject } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { AbstractComponent } from "src/app/abstract-component";
import { NgbdSortableHeader } from "src/app/controls/table-sortable/table-sortable.directive";
import { SortEvent } from "src/app/controls/table-sortable/table-sortable.types";
import {
  RepositoryModifiedEvent,
  RepositorySelectedEvent,
  RepositorySelectionType
} from "src/app/main/dashboard/dashboard.types";
import { unwrapApolloResult } from "src/app/utils/gql-result.operator";
import { environment } from "src/environments/environment";
import { GitRepository } from "src/generated/graphql";
import { nonNull } from "src/utils/check";
import { multiFork } from "src/utils/multifork";
import { utils } from "src/utils/utils";

interface RepositoryListItem {
  path: string;
  loaded: boolean;
  lastFetchDate: number | null;
  staged: number | null;
  unstaged: number | null;
  untracked: number | null;
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

  private _repositories: RepositoryListItem[] = [];

  constructor(private readonly apollo: Apollo, protected readonly injector: Injector) {
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
          lastFetchDate: null,
          staged: null,
          unstaged: null,
          untracked: null,
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
          workingDirectory {
            staged { status },
            unstaged { status },
            untracked { status }
          },
          head { displayName },
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
        repository.lastFetchDate = result.lastFetchDate;
        repository.staged = workingDirectory.staged.length;
        repository.unstaged = workingDirectory.unstaged.length;
        repository.untracked = workingDirectory.untracked.length;
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
}

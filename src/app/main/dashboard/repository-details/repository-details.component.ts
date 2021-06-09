import { Component, HostListener, Injector, Input, ViewChild } from '@angular/core';
import { gql } from "@apollo/client/core";
import { NgbAccordion } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { OperationVariables } from "apollo-client";
import { DocumentNode } from "graphql";
import { from, Observable, of, Subject } from "rxjs";
import { filter, map, mergeMap, tap } from "rxjs/operators";
import { AbstractComponent } from "src/app/abstract-component";
import { RepositoryModifiedEvent, RepositorySelectedEvent } from "src/app/main/dashboard/dashboard.types";
import { debug } from "src/app/utils/gql-debug.operator";
import { unwrapApolloResult } from "src/app/utils/gql-result.operator";
import { GitRepository } from "src/generated/graphql";
import { nonNull } from "src/utils/check";
import { utils } from "src/utils/utils";

@Component({
  selector: 'app-repository-details',
  templateUrl: './repository-details.component.html',
  styleUrls: ['./repository-details.component.css']
})
export class RepositoryDetailsComponent extends AbstractComponent {

  @ViewChild('panelAccordion')
  accordionComponent?: NgbAccordion;

  @Input()
  repositorySelected?: Subject<RepositorySelectedEvent|null>;

  @Input()
  repositoryModified?: Subject<RepositoryModifiedEvent>;

  private _repository?: GitRepository;

  untrackedFiles: {path: string}[] = [];

  constructor(private readonly apollo: Apollo, protected readonly injector: Injector) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();

    nonNull(this.repositorySelected, "repositorySelected");
    nonNull(this.repositoryModified, "repositoryModified");

    this.repositorySelected!
      .pipe(this.untilDestroyed())
      .pipe(filter(event => !!event))
      .pipe(mergeMap(event => this.loadRepository(event!.path)))
      .subscribe(utils.subscriber());
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    console.log("XXX");

    this.repositorySelected!
      .pipe(this.untilDestroyed())
      .pipe(filter(event => !!event))
      .pipe(map(event => event!.selectionType))
      .pipe(tap(type => {

        if (type === 'staged') {
          this.accordionComponent!.activeIds = 'panel-staged';
        }
        if (type === 'unstaged') {
          this.accordionComponent!.activeIds = 'panel-unstaged';
        }
        if (type === 'untracked') {
          this.accordionComponent!.activeIds = 'panel-untracked';
        }
        if (type === 'branches') {
          this.accordionComponent!.activeIds = 'panel-branches';
        }
        if (type === 'stashes') {
          this.accordionComponent!.activeIds = 'panel-stashes';
        }
        if (type === 'lastCommitDate') {
          this.accordionComponent!.activeIds = 'panel-recent-commits';
        }
      }))
      .subscribe(utils.subscriber());
  }

  private loadRepository(repoPath: string): Observable<void> {

    const query: DocumentNode = gql`
      query getRepoDetails($repoPath: String!) {
        result: repository(path: $repoPath) {
          path,
          lastFetchDate,
          workingDirectory {
            staged { status, path },
            unstaged { status, path },
            untracked { status, path }
          },
          head {
            refName,
            displayName,
            commit {
              id,
              author { name, emailAddress, timestamp },
              committer { name, emailAddress, timestamp },
              subject,
              message,
              refNotes
            },
            ... on GitBranch {
              upstreamDistance { ahead, behind }
            }
          },
          branches {
            refName,
            displayName,
            upstream { refName, displayName },
            upstreamDistance { ahead, behind },
            commit {
              id,
              author { name, emailAddress, timestamp },
              committer { name, emailAddress, timestamp },
              subject,
              message,
              refNotes
            }
          },
          stashes {
            refName,
            displayName,
            message,
            timestamp
          },
          recentCommits(count: 50) {
            id,
            author { name, emailAddress, timestamp },
            committer { name, emailAddress, timestamp },
            subject,
            message,
            reachableBy { refName, displayName }
          }
        }
      }
    `;

    const variables: OperationVariables = {
      repoPath: repoPath
    };

    const waitComplete = this.incrementWaitCount();

    return this.apollo.query<{ result: GitRepository }>({query, variables})
      .pipe(debug())
      .pipe(unwrapApolloResult())
      .pipe(map(result => result.result))
      .pipe(mergeMap(result => {

        this._repository = result;

        this.untrackedFiles = (result.workingDirectory ? result.workingDirectory.untracked.map(item => ({path: item.path})) : []);
        this.untrackedFiles.sort();

        waitComplete();

        return of(void 0);
      }));
  }

  get repoPath() {
    return (this._repository && this._repository.path) || "";
  }

  get repoHead() {
    return this._repository?.head;
  }

  get repoHeadCommit() {
    return this._repository?.head?.commit;
  }

  get repo() {
    return this._repository;
  }

  refreshRepository() {
    if (this._repository) {
      const waitComplete = this.incrementWaitCount();
      from(this.apollo.client.clearStore())
        .pipe(mergeMap(() => this.loadRepository(this._repository!.path)))
        .subscribe(utils.subscriber(() => waitComplete()));
    }
  }

  closePanel() {
    this.repositorySelected?.next(null);
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.code === 'Escape') {
      this.closePanel();
    }
  }
}

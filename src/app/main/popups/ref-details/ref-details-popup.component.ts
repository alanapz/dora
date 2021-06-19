import { Component, Injector, Input } from '@angular/core';
import { gql } from "@apollo/client/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { map, mergeMap } from "rxjs/operators";
import { AbstractComponent } from "src/app/abstract-component";
import { GraphQLService } from "src/app/services/graphql.service";
import { GitCommit, GitRef, GitRepository } from "src/generated/graphql";
import { nonNullNotEmpty } from "src/utils/check";
import { utils } from "src/utils/utils";

@Component({
  selector: 'app-ref-details-popup',
  templateUrl: './ref-details-popup.component.html',
  styleUrls: ['./ref-details-popup.component.css']
})
export class RefDetailsPopupComponent extends AbstractComponent {

  @Input() repoPath: string = '';

  @Input() refName: string = '';

  @Input() displayName: string = '';

  ref?: GitRef;

  private readonly refsSeen = new Set<string>();

  constructor(
    protected readonly injector: Injector,
    private readonly graphql: GraphQLService,
    private readonly activeModal: NgbActiveModal) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    nonNullNotEmpty(this.repoPath, "repoPath");
    nonNullNotEmpty(this.refName, "refName");
    nonNullNotEmpty(this.displayName, "displayName");

    const waitComplete = this.incrementWaitCount();

    const query = gql`
      query getRefDetails($repoPath: String!, $refName: String!) {
        result: repository(path: $repoPath) {
          ref(name: $refName) {
            refName
            displayName
            ancestors(count: 100) {
              id
              author { name, emailAddress, timestamp },
              committer { name, emailAddress, timestamp }
              subject
              message
              reachableBy {
                refName
                displayName
                ... on GitTrackingBranch {
                  isTrunk
                  webUrl { remote { name }, url }
                }
              }
              webUrls { remote { name }, url }
            },
            ... on GitBranch {
              upstream {
                webUrl { remote { name }, url },
              }
            }
            ... on GitTrackingBranch {
              webUrl { remote { name }, url },
            }
          }
        }
      }
    `;

    const variables = { repoPath: this.repoPath, refName: this.refName };

    this.graphql.query<{ result: GitRepository }>({query, variables})
      .pipe(map(result => result.result.ref))
      .pipe(mergeMap(result => {
        this.ref = result;
        waitComplete();
        return utils.ofVoid();
      })).subscribe(utils.subscriber());
  }

  closePanel() {
    this.activeModal.close(null);
  }

  get commits(): GitCommit[] {
    this.refsSeen.clear();
    return this.ref?.ancestors || [];
  }

  isNewRef(refName: string): boolean {
    if (this.refsSeen.has(refName)) {
      return false;
    }
    this.refsSeen.add(refName);
    return true;
  }
}

import { Component, Injector, Input } from '@angular/core';
import { gql } from "@apollo/client/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { OperationVariables } from "apollo-client";
import { DocumentNode } from "graphql";
import { map, mergeMap } from "rxjs/operators";
import { AbstractComponent } from "src/app/abstract-component";
import { unwrapApolloResult } from "src/app/utils/gql-result.operator";
import { GitRef, GitRepository } from "src/generated/graphql";
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

  constructor(
    protected readonly injector: Injector,
    private readonly apollo: Apollo,
    private readonly activeModal: NgbActiveModal) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    nonNullNotEmpty(this.repoPath, "repoPath");
    nonNullNotEmpty(this.refName, "refName");
    nonNullNotEmpty(this.displayName, "displayName");

    const waitComplete = this.incrementWaitCount();

    const query: DocumentNode = gql`
      query getRefDetails($repoPath: String!, $refName: String!) {
        result: repository(path: $repoPath) {
          ref(name: $refName) {
            refName,
            displayName,
            ancestors(count: 100) {
              id,
              author { name, emailAddress, timestamp },
              committer { name, emailAddress, timestamp },
              subject,
              message,
              refNotes
            }
          }
        }
      }
    `;

    const variables: OperationVariables = {
      repoPath: this.repoPath,
      refName: this.refName
    };

    this.apollo.query<{ result: GitRepository }>({query, variables})
      .pipe(unwrapApolloResult())
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
}

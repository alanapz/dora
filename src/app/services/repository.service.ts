import { Injectable } from '@angular/core';
import { gql, OperationVariables } from "@apollo/client/core";
import { Apollo } from "apollo-angular";
import { DocumentNode } from "graphql";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { GitRepository } from "src/generated/graphql";

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor(private readonly apollo: Apollo) {

  }

  fetchRepository(repoPath: string): Observable<void> {

    const mutation: DocumentNode = gql`
      mutation fetchRepo($repoPath: String!) {
        result: repository(path: $repoPath) {
          fetch
        }
      }
    `;

    const variables: OperationVariables = { repoPath };

    return this.apollo.mutate<{ result: GitRepository }>({mutation, variables})
      .pipe(tap(x => { console.log(x)}))
      //.pipe(unwrapApolloResult())
      .pipe(map(() => (void 0)));
  }
}

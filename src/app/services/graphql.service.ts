import { Injectable } from '@angular/core';
import { Apollo } from "apollo-angular";
import { DocumentNode } from "graphql";
import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { unwrapApolloResult } from "src/app/utils/gql-result.operator";
import { utils } from "src/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class GraphQLService {

  constructor(private readonly apollo: Apollo) {

  }

  query<T>(options: {query: DocumentNode, variables?: Record<string, any>}): Observable<T> {
    return this.apollo.query<T>({fetchPolicy: 'no-cache', ... options}).pipe(unwrapApolloResult());
  }

  mutate(options: {mutation: DocumentNode, variables?: Record<string, any>}): Observable<void> {
    return this.apollo.mutate({fetchPolicy: 'no-cache', ... options}).pipe(mergeMap(() => utils.ofVoid()));
  }
}

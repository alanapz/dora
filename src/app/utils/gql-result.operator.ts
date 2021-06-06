import { Observable, OperatorFunction } from 'rxjs';
import { MapOperator } from "rxjs/internal/operators/map";

export function unwrapApolloResult<T>(thisArg?: any): OperatorFunction<{data: T}, T> {
  return function mapOperation(source: Observable<{data: T}>): Observable<T> {
    return source.lift(new MapOperator<{data: T}, T>(res => res.data, thisArg));
  };
}

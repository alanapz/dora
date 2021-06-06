import { concat, EMPTY, forkJoin, Observable, Subscriber } from 'rxjs';
import { first, map } from 'rxjs/operators';

interface Input<T> {
  result: T;
  index: number;
}

export function multiFork<O1>(concurrency: number, sources: [
  Observable<O1>]): Observable<[O1]>;

export function multiFork<O1, O2>(concurrency: number, sources: [
  Observable<O1>,
  Observable<O2>]): Observable<[O1, O2]>;

export function multiFork<O1, O2, O3>(concurrency: number, sources: [
  Observable<O1>,
  Observable<O2>,
  Observable<O3>]): Observable<[O1, O2, O3]>;

export function multiFork<O1, O2, O3, O4>(concurrency: number, sources: [
  Observable<O1>,
  Observable<O2>,
  Observable<O3>,
  Observable<O4>]): Observable<[O1, O2, O3, O4]>;

export function multiFork<O1, O2, O3, O4, O5>(concurrency: number, sources: [
  Observable<O1>,
  Observable<O2>,
  Observable<O3>,
  Observable<O4>,
  Observable<O5>]): Observable<[O1, O2, O3, O4, O5]>;

export function multiFork<O1, O2, O3, O4, O5, O6>(concurrency: number, sources: [
  Observable<O1>,
  Observable<O2>,
  Observable<O3>,
  Observable<O4>,
  Observable<O5>,
  Observable<O6>]): Observable<[O1, O2, O3, O4, O5, O6]>;

export function multiFork<O1, O2, O3, O4, O5, O6, O7>(concurrency: number, sources: [
  Observable<O1>,
  Observable<O2>,
  Observable<O3>,
  Observable<O4>,
  Observable<O5>,
  Observable<O6>,
  Observable<O7>]): Observable<[O1, O2, O3, O4, O5, O6, O7]>;

export function multiFork<O1, O2, O3, O4, O5, O6, O7, O8>(concurrency: number, sources: [
  Observable<O1>,
  Observable<O2>,
  Observable<O3>,
  Observable<O4>,
  Observable<O5>,
  Observable<O6>,
  Observable<O7>,
  Observable<O8>]): Observable<[O1, O2, O3, O4, O5, O6, O7, O8]>;

export function multiFork<O1, O2, O3, O4, O5, O6, O7, O8, O9>(concurrency: number, sources: [
  Observable<O1>,
  Observable<O2>,
  Observable<O3>,
  Observable<O4>,
  Observable<O5>,
  Observable<O6>,
  Observable<O7>,
  Observable<O8>,
  Observable<O9>]): Observable<[O1, O2, O3, O4, O5, O6, O7, O8, O9]>;

export function multiFork<T>(concurrency: number, sources: Observable<T>[]): Observable<T[]>;

export function multiFork<T>(concurrency: number, sources: Observable<T>[]): Observable<T[]> {
  // Skip immediately if we have nothing to do
  if (sources.length === 0) {
    return EMPTY;
  }

  // Wrap every observable so we can retrieve it's initial position in the array
  // Then distribute into buckets - so we wil have an array (of buckets) of observables (with index)
  const buckets: Observable<Input<T>>[][] = distribute(concurrency, sources.map((source: Observable<T>, index: number): Observable<Input<T>> => {
    return source.pipe(first(), map((result: T) => ({ result, index })));
  }));

  // Perform an inner fork-join on buckets
  const observables: Observable<Input<T>[]>[] = buckets.map((bucket) => innerMultiFork(bucket));

  // Wait on each bucket (in an outer fork join) before reconstituting results
  return forkJoin(observables).pipe(map((allResults: Input<T>[][]): T[] => {
    const buffer: T[] = [];
    // Attempt to reconstitute results, we loop through each result for each bucket
    allResults.forEach((bucket: Input<T>[]) => {
      bucket.forEach((result: Input<T>) => {
        // Update our global buffer - we need this we can't be sure of the order of results on inner fork join
        buffer[result.index] = result.result;
      });
    });
    return buffer;
  }));
}

function innerMultiFork<T>(sources: Observable<Input<T>>[]): Observable<Input<T>[]> {

  // Used to simply perform a concat of all inner observables
  return new Observable<Input<T>[]>((subscriber: Subscriber<Input<T>[]>) => {

    const results: Input<T>[] = [];

    const next = (result: Input<T>): void => {
      results.push(result);
    };

    const error = (err?: any): void => {
      subscriber.error(err);
    };

    const complete = (): void => {
      subscriber.next(results);
      subscriber.complete();
    };

    concat(...sources).subscribe({ next, error, complete});
  });
}

/**
 * Simply distributes an array of size M into N buckets (by using % to distribute each element into a bucket)
 */
function distribute<T>(buckets: number, input: T[]): T[][] {
  const results: T[][] = [];
  input.forEach((value: T, index: number): void => {
    results[index % buckets] = [...(results[index % buckets] || []), value];
  });
  return results;
}

import { EMPTY, Observable, PartialObserver } from "rxjs";

export interface SortCallback<T> {
  func: (input: T) => any;
  descending?: boolean
}

export const utils = {

  as<T>(obj: T): T {
    return obj;
  },

  coalesce<T>(...values: (T | null | undefined)[]): T | null {
    for (const value of values) {
      if (value !== null && value !== undefined) {
        return value;
      }
    }
    return null;
  },

  errorHandler(err?: any): Observable<never> {
    console.error('ERROR', err);
    return EMPTY;
  },

  subscriber<T>(next?: (value: T) => void): PartialObserver<T> {
    return {next, error: this.errorHandler};
  },

  groupBy<K extends string | number | symbol, T>(source: T[], classifier: (input: T) => K): Record<K, T[]> {
    const result: Record<K, T[]> = ({} as Record<K, T[]>);
    source.forEach((item: T) => {
      const key: K = classifier(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
    });
    return result;
  },

  orderBy<T>(...callbacks: SortCallback<T>[]): ((a: T, b: T) => number) {
    return (left: T, right: T) => {
      for (const callback of callbacks) {
        const val1: any = callback.func(left);
        const val2: any = callback.func(right);
        if ((val1 < val2)) {
          return (callback.descending ? 1 : -1);
        }
        if (val1 > val2) {
          return (callback.descending ? -1 : 1);
        }
      }
      return 0;
    };
  }

};

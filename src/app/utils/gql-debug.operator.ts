import { MonoTypeOperatorFunction } from "rxjs";
import { tap } from "rxjs/operators";

export function debug<T>(): MonoTypeOperatorFunction<T> {
  return tap(r => console.log("Result:", r), e => console.error("Error:", e), () => console.log("(Stream complete)"));
}

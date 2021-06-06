import { AfterViewInit, Directive, Injector, OnDestroy, OnInit } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Directive()
export abstract class AbstractComponent implements OnInit, OnDestroy, AfterViewInit {

  protected abstract injector: Injector;

  private readonly onDestroy = new Subject<void>();

  private waitCount = 0;

  ngOnInit(): void {
    // Nothing to do
  }

  ngAfterViewInit(): void {
    // Nothing to do
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  incrementWaitCount(): () => void {
    this.waitCount++;
    return () => { this.waitCount--; };
  }

  get loadComplete(): boolean {
    return (this.waitCount === 0);
  }

  untilDestroyed<T>(): MonoTypeOperatorFunction<T> {
    return takeUntil<T>(this.onDestroy);
  }

  wrap<T>(source: Observable<T>): Observable<T> {
    this.waitCount++;
    return source.pipe(
      // tap(() => this.waitingCount++),
      takeUntil(this.onDestroy),
      finalize(() => this.waitCount--));
  }
}

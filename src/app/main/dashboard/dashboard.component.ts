import { Component, Injector } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { AbstractComponent } from "src/app/abstract-component";
import { RepositoryModifiedEvent, RepositorySelectedEvent } from "src/app/main/dashboard/dashboard.types";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends AbstractComponent {

  readonly repositorySelected = new BehaviorSubject<RepositorySelectedEvent|null>(null);

  readonly repositoryModified = new ReplaySubject<RepositoryModifiedEvent>(1);

  constructor(protected readonly injector: Injector) {
    super();
  }

  get fullScreenMode() {
    return !this.repositorySelected.value;
  }
}

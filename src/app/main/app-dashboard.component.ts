import { Component, Injector } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";

declare type TabName = 'repositories' | 'branches';

@Component({
  selector: 'app-dashboard',
  templateUrl: './app-dashboard.component.html',
  styleUrls: ['./app-dashboard.component.css']
})
export class AppDashboardComponent extends AbstractComponent {

  active: TabName = "repositories";

  constructor(protected readonly injector: Injector) {
    super();
  }

  tabClicked(name: TabName) {
    this.active = name;
    return false;
  }
}

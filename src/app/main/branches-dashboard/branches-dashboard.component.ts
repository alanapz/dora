import { Component, Injector } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";

@Component({
  selector: 'app-branches-dashboard',
  templateUrl: './branches-dashboard.component.html',
  styleUrls: ['./branches-dashboard.component.css']
})
export class BranchesDashboardComponent extends AbstractComponent {

  constructor(protected readonly injector: Injector) {
    super();
  }
}

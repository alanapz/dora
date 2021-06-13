import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { GitRepository } from "src/generated/graphql";

@Component({
  selector: 'app-repository-details-branches',
  templateUrl: './repository-details-branches.component.html',
  styleUrls: ['./repository-details-branches.component.css']
})
export class RepositoryDetailsBranchesComponent extends AbstractComponent {

  active = "summary";

  @Input("repo")
  _repo?: GitRepository;

  constructor(protected readonly injector: Injector) {
    super();
  }

  get repo() {
    return this._repo!;
  }

  tabClicked(name: string) {
    this.active = name;
    return false;
  }
}

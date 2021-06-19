import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { GitCommit, GitRepository } from "src/generated/graphql";

@Component({
  selector: 'app-repository-details-recent-commits',
  templateUrl: './repository-details-recent-commits.component.html',
  styleUrls: ['./repository-details-recent-commits.component.css']
})
export class RepositoryDetailsRecentCommitsComponent extends AbstractComponent {

  @Input("repo")
  _repo?: GitRepository;

  constructor(protected readonly injector: Injector) {
    super();
  }

  get commits(): GitCommit[] {
    return this._repo!.recentCommits;
  }

  get repoPath() {
    return this._repo!.path;
  }
}

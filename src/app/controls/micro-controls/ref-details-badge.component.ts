import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { AppUtils } from "src/app/app-utils";
import { GitRef, GitWebUrl } from "src/generated/graphql";
import { nonNull, nonNullNotEmpty } from "src/utils/check";

@Component({
  selector: 'app-ref-details-badge',
  templateUrl: './ref-details-badge.component.html',
  styleUrls: ['./ref-details-badge.component.css']
})
export class RefDetailsBadgeComponent extends AbstractComponent {

  @Input()
  public repoPath?: string;

  @Input()
  public ref?: GitRef;

  constructor(protected readonly injector: Injector) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    nonNullNotEmpty(this.repoPath, "repoPath");
    nonNull(this.ref, "ref");
    nonNullNotEmpty(this.ref?.refName, "refName");
    nonNullNotEmpty(this.ref?.displayName, "displayName");

    if (AppUtils.isRefTrackingBranch(this.ref)) {
      nonNull(this.ref.isTrunk, "isTrunk");
    }
  }

  get branchType() {
    if (AppUtils.isRefBranch(this.ref)) {
      return 'primary';
    }
    if (AppUtils.isRefTrackingBranch(this.ref) && !this.ref.isTrunk) {
      return 'info';
    }
    if (AppUtils.isRefTrackingBranch(this.ref) && this.ref.isTrunk) {
      return 'success';
    }
    if (AppUtils.isRefTag(this.ref)) {
      return 'secondary';
    }
    return null;
  }

  get webUrls(): GitWebUrl[] {
    if (AppUtils.isRefTrackingBranch(this.ref) && this.ref.webUrl) {
      return [ this.ref!.webUrl ];
    }
    return [];
  }
}

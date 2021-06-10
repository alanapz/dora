import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { AppUtils } from "src/app/app-utils";
import { GitRef, GitWebUrl } from "src/generated/graphql";

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

  get isBranch(): boolean {
    return AppUtils.isRefBranch(this.ref);
  }

  get isTrackingBranch(): boolean {
    return AppUtils.isRefTrackingBranch(this.ref);
  }

  get webUrls(): GitWebUrl[] {
    if (AppUtils.isRefTrackingBranch(this.ref) && this.ref.webUrl) {
      return [ this.ref!.webUrl ];
    }
    return [];
  }
}

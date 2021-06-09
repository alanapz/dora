import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { GitRef } from "src/generated/graphql";

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

  isType(type: 'GitBranch' | 'GitTrackingBranch' | 'GitTag'): boolean {
    return (this.ref as any).__typename === type;
  }
}

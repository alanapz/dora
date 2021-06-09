import { Directive, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Directive({
  selector: 'a[commitdetails]',
  host: {
    '(click)': 'openWindow()'
  }
})
export class CommitDetailsPopupLinkDirective {

  @Input() repoPath: string = '';

  @Input() commitId: string = '';

  constructor(private readonly modalService: NgbModal) {
  }

  openWindow() {
    alert(this.commitId);
    return false;
  }
}

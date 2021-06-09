import { Directive, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RefDetailsPopupComponent } from "src/app/main/popups/ref-details/ref-details-popup.component";

@Directive({
  selector: 'a[refdetails]',
  host: {
    '(click)': 'openWindow()'
  }
})
export class RefDetailsPopupLinkDirective {

  @Input() repoPath: string = '';

  @Input() refName: string = '';

  @Input() displayName: string = '';

  constructor(private readonly modalService: NgbModal) {
  }

  openWindow() {
    const modalRef = this.modalService.open(RefDetailsPopupComponent, { size: 'xl' });
    const popup = (modalRef.componentInstance as RefDetailsPopupComponent);
    popup.repoPath = this.repoPath;
    popup.refName = this.refName;
    popup.displayName = this.displayName;
    return false;
  }
}

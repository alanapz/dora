import { NgModule } from '@angular/core';
import { CommitDetailsPopupLinkDirective } from "src/app/directives/commit-details-popup-link/commit-details-popup-link.directive";
import { RefDetailsPopupLinkDirective } from "src/app/directives/ref-details-popup-link/ref-details-popup-link.directive";
import { NgbdSortableHeader } from "src/app/directives/table-sortable/table-sortable.directive";

@NgModule({
  declarations: [
    CommitDetailsPopupLinkDirective,
    RefDetailsPopupLinkDirective,
    NgbdSortableHeader
  ],
  exports: [
    CommitDetailsPopupLinkDirective,
    RefDetailsPopupLinkDirective,
    NgbdSortableHeader
  ]
})
export class AppDirectivesModule { }

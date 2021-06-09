import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "src/app/app-routing.module";
import { BootstrapIconComponent } from "src/app/controls/bootstrap-icon/bootstrap-icon.component";
import { RefDetailsBadgeComponent } from "src/app/controls/micro-controls/ref-details-badge.component";
import { QuickTableSelectHeaderComponent } from "src/app/controls/quick-table-select-header/quick-table-select-header.component";
import { QuickTableSelectRowComponent } from "src/app/controls/quick-table-select-row/quick-table-select-row.component";
import { ToastsContainer } from "src/app/controls/toasts-container/toasts-container.component";
import { WebUrlLinkComponent } from "src/app/controls/web-url-link/web-url-link.component";
import { AppDirectivesModule } from "src/app/directives/app-directives.module";
import { AppPipesModule } from "src/app/pipes/app-pipes.module";

@NgModule({
  declarations: [
    BootstrapIconComponent,
    RefDetailsBadgeComponent,
    ToastsContainer,
    WebUrlLinkComponent,
    QuickTableSelectHeaderComponent,
    QuickTableSelectRowComponent,
  ],
  exports: [
    BootstrapIconComponent,
    RefDetailsBadgeComponent,
    ToastsContainer,
    WebUrlLinkComponent,
    QuickTableSelectHeaderComponent,
    QuickTableSelectRowComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    DragDropModule,
    AppPipesModule,
    AppDirectivesModule
  ]
})
export class AppControlsModule { }

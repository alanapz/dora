import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AppControlsModule } from "src/app/controls/app-controls.module";
import { AppDirectivesModule } from "src/app/directives/app-directives.module";
import { BranchesDashboardComponent } from "src/app/main/branches-dashboard/branches-dashboard.component";
import { BranchesListComponent } from "src/app/main/branches-dashboard/branches-list/branches-list.component";
import { AppPipesModule } from "src/app/pipes/app-pipes.module";

@NgModule({
  declarations: [
    BranchesDashboardComponent,
    BranchesListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    DragDropModule,
    AppControlsModule,
    AppPipesModule,
    AppDirectivesModule
  ],
  exports: [
    BranchesDashboardComponent
  ]
})
export class BranchesDashboardModule { }

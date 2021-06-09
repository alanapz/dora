import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AppControlsModule } from "src/app/controls/app-controls.module";
import { AppDirectivesModule } from "src/app/directives/app-directives.module";
import { RepositoryDashboardComponent } from "src/app/main/repository-dashboard/repository-dashboard.component";
import { RepositoryDetailsBranchesCommitsComponent } from "src/app/main/repository-dashboard/repository-details/repository-details-branches/repository-details-branches-commits/repository-details-branches-commits.component";
import { RepositoryDetailsBranchesSummaryComponent } from "src/app/main/repository-dashboard/repository-details/repository-details-branches/repository-details-branches-summary/repository-details-branches-summary.component";
import { RepositoryDetailsBranchesComponent } from "src/app/main/repository-dashboard/repository-details/repository-details-branches/repository-details-branches.component";
import { RepositoryDetailsRecentCommitsComponent } from "src/app/main/repository-dashboard/repository-details/repository-details-recent-commits/repository-details-recent-commits.component";
import { RepositoryDetailsStagedComponent } from "src/app/main/repository-dashboard/repository-details/repository-details-staged/repository-details-staged.component";
import { RepositoryDetailsStashesComponent } from "src/app/main/repository-dashboard/repository-details/repository-details-stashes/repository-details-stashes.component";
import { RepositoryDetailsUnstagedComponent } from "src/app/main/repository-dashboard/repository-details/repository-details-unstaged/repository-details-unstaged.component";
import { RepositoryDetailsUntrackedComponent } from "src/app/main/repository-dashboard/repository-details/repository-details-untracked/repository-details-untracked.component";
import { RepositoryDetailsComponent } from "src/app/main/repository-dashboard/repository-details/repository-details.component";
import { RepositoryListComponent } from "src/app/main/repository-dashboard/repository-list/repository-list.component";
import { AppPipesModule } from "src/app/pipes/app-pipes.module";

@NgModule({
  declarations: [
    RepositoryDashboardComponent,
    RepositoryListComponent,
    RepositoryDetailsComponent,
    RepositoryDetailsBranchesComponent,
    RepositoryDetailsBranchesSummaryComponent,
    RepositoryDetailsBranchesCommitsComponent,
    RepositoryDetailsUntrackedComponent,
    RepositoryDetailsUnstagedComponent,
    RepositoryDetailsStagedComponent,
    RepositoryDetailsStashesComponent,
    RepositoryDetailsRecentCommitsComponent,
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
    RepositoryDashboardComponent
  ]
})
export class RepositoryDashboardModule { }

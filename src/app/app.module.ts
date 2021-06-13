import { DragDropModule } from "@angular/cdk/drag-drop";
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppControlsModule } from "src/app/controls/app-controls.module";
import { AppDirectivesModule } from "src/app/directives/app-directives.module";
import { DashboardComponent } from "src/app/main/dashboard/dashboard.component";
import { RepositoryDetailsBranchesCommitsComponent } from "src/app/main/dashboard/repository-details/repository-details-branches/repository-details-branches-commits/repository-details-branches-commits.component";
import { RepositoryDetailsBranchesSummaryComponent } from "src/app/main/dashboard/repository-details/repository-details-branches/repository-details-branches-summary/repository-details-branches-summary.component";
import { RepositoryDetailsBranchesComponent } from "src/app/main/dashboard/repository-details/repository-details-branches/repository-details-branches.component";
import { RepositoryDetailsRecentCommitsComponent } from "src/app/main/dashboard/repository-details/repository-details-recent-commits/repository-details-recent-commits.component";
import { RepositoryDetailsStagedComponent } from "src/app/main/dashboard/repository-details/repository-details-staged/repository-details-staged.component";
import { RepositoryDetailsStashesComponent } from "src/app/main/dashboard/repository-details/repository-details-stashes/repository-details-stashes.component";
import { RepositoryDetailsUnstagedComponent } from "src/app/main/dashboard/repository-details/repository-details-unstaged/repository-details-unstaged.component";
import { RepositoryDetailsUntrackedComponent } from "src/app/main/dashboard/repository-details/repository-details-untracked/repository-details-untracked.component";
import { RepositoryDetailsComponent } from "src/app/main/dashboard/repository-details/repository-details.component";
import { RepositoryListComponent } from "src/app/main/dashboard/repository-list/repository-list.component";
import { RefDetailsPopupComponent } from "src/app/main/popups/ref-details/ref-details-popup.component";
import { AppPipesModule } from "src/app/pipes/app-pipes.module";
import { RepositoryService } from "src/app/services/repository.service";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
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
    RefDetailsPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    DragDropModule,
    GraphQLModule,
    HttpClientModule,
    AppControlsModule,
    AppDirectivesModule,
    AppPipesModule
  ],
  entryComponents: [RefDetailsPopupComponent],
  providers: [RepositoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }

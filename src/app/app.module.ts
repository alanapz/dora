import { DragDropModule } from "@angular/cdk/drag-drop";
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapIconComponent } from "src/app/controls/bootstrap-icon/bootstrap-icon.component";
import { CommitDetailsPopupLinkDirective } from "src/app/controls/commit-details-popup-link/commit-details-popup-link.directive";
import { RefDetailsBadgeComponent } from "src/app/controls/micro-controls/ref-details-badge.component";
import { RefDetailsPopupLinkDirective } from "src/app/controls/ref-details-popup-link/ref-details-popup-link.directive";
import { NgbdSortableHeader } from "src/app/controls/table-sortable/table-sortable.directive";
import { ToastsContainer } from "src/app/controls/toasts-container/toasts-container.component";
import { DashboardComponent } from "src/app/main/dashboard/dashboard.component";
import { RepositoryDetailsBranchesComponent } from "src/app/main/dashboard/repository-details/repository-details-branches/repository-details-branches.component";
import { RepositoryDetailsRecentCommitsComponent } from "src/app/main/dashboard/repository-details/repository-details-recent-commits/repository-details-recent-commits.component";
import { RepositoryDetailsStagedComponent } from "src/app/main/dashboard/repository-details/repository-details-staged/repository-details-staged.component";
import { RepositoryDetailsStashesComponent } from "src/app/main/dashboard/repository-details/repository-details-stashes/repository-details-stashes.component";
import { RepositoryDetailsUnstagedComponent } from "src/app/main/dashboard/repository-details/repository-details-unstaged/repository-details-unstaged.component";
import { RepositoryDetailsUntrackedComponent } from "src/app/main/dashboard/repository-details/repository-details-untracked/repository-details-untracked.component";
import { RepositoryDetailsComponent } from "src/app/main/dashboard/repository-details/repository-details.component";
import { RepositoryListComponent } from "src/app/main/dashboard/repository-list/repository-list.component";
import { RefDetailsPopupComponent } from "src/app/main/popups/ref-details/ref-details-popup.component";
import { RepositoryService } from "src/app/services/repository.service";
import { DurationPipe } from "src/app/utils/duration.pipe";
import { NumericPipe } from "src/app/utils/numeric.pipe";
import { TimestampPipe } from "src/app/utils/timestamp.pipe";
import { TruncatePipe } from "src/app/utils/truncate.pipe";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';

@NgModule({
  declarations: [
    NgbdSortableHeader,
    BootstrapIconComponent,
    DurationPipe,
    NumericPipe,
    TimestampPipe,
    TruncatePipe,
    RefDetailsBadgeComponent,
    AppComponent,
    DashboardComponent,
    RepositoryListComponent,
    RepositoryDetailsComponent,
    RepositoryDetailsBranchesComponent,
    RepositoryDetailsUntrackedComponent,
    RepositoryDetailsUnstagedComponent,
    RepositoryDetailsStagedComponent,
    RepositoryDetailsStashesComponent,
    RepositoryDetailsRecentCommitsComponent,
    ToastsContainer,
    RefDetailsPopupComponent,
    RefDetailsPopupLinkDirective,
    CommitDetailsPopupLinkDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    DragDropModule,
    GraphQLModule,
    HttpClientModule,
  ],
  entryComponents: [RefDetailsPopupComponent],
  providers: [RepositoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }

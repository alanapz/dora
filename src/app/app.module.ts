import { DragDropModule } from "@angular/cdk/drag-drop";
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppControlsModule } from "src/app/controls/app-controls.module";
import { AppDirectivesModule } from "src/app/directives/app-directives.module";
import { AppDashboardComponent } from "src/app/main/app-dashboard.component";
import { BranchesDashboardModule } from "src/app/main/branches-dashboard/branches-dashboard.module";
import { RefDetailsPopupComponent } from "src/app/main/popups/ref-details/ref-details-popup.component";
import { RepositoryDashboardModule } from "src/app/main/repository-dashboard/repository-dashboard.module";
import { AppPipesModule } from "src/app/pipes/app-pipes.module";
import { GraphQLService } from "src/app/services/graphql.service";
import { RepositoryService } from "src/app/services/repository.service";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';

@NgModule({
  declarations: [
    AppComponent,
    AppDashboardComponent,
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
    AppPipesModule,
    RepositoryDashboardModule,
    BranchesDashboardModule,
  ],
  entryComponents: [RefDetailsPopupComponent],
  providers: [GraphQLService, RepositoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }

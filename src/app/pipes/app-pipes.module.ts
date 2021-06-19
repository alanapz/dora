import { NgModule } from '@angular/core';
import { BranchDistancePipe } from "src/app/pipes/branch-distance.pipe";
import { DurationPipe } from "src/app/pipes/duration.pipe";
import { NumericPipe } from "src/app/pipes/numeric.pipe";
import { TimestampPipe } from "src/app/pipes/timestamp.pipe";
import { TruncatePipe } from "src/app/pipes/truncate.pipe";

@NgModule({
  declarations: [
    DurationPipe,
    NumericPipe,
    TimestampPipe,
    TruncatePipe,
    BranchDistancePipe,
  ],
  exports: [
    DurationPipe,
    NumericPipe,
    TimestampPipe,
    TruncatePipe,
    BranchDistancePipe,
  ],
})
export class AppPipesModule { }

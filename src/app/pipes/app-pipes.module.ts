import { NgModule } from '@angular/core';
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
  ],
  exports: [
    DurationPipe,
    NumericPipe,
    TimestampPipe,
    TruncatePipe,
  ],
})
export class AppPipesModule { }

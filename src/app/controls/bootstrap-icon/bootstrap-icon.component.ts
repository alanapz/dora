import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { nonNullNotEmpty } from "src/utils/check";

@Component({
  selector: 'app-bootstrap-icon',
  templateUrl: './bootstrap-icon.component.html'
})
export class BootstrapIconComponent extends AbstractComponent {

  @Input()
  public iconName?: string;

  @Input()
  public iconSize: string = '1em';

  constructor(protected readonly injector: Injector) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();

    nonNullNotEmpty(this.iconName, "iconName");
    nonNullNotEmpty(this.iconSize, "iconSize");
  }
}

import { Component, Injector, Input } from '@angular/core';
import { AbstractComponent } from "src/app/abstract-component";
import { GitWebUrl } from "src/generated/graphql";

@Component({
  selector: 'app-web-url-link',
  templateUrl: './web-url-link.component.html',
  styleUrls: ['./web-url-link.component.css']
})
export class WebUrlLinkComponent extends AbstractComponent {

  @Input()
  public link?: GitWebUrl;

  constructor(protected readonly injector: Injector) {
    super();
  }
}

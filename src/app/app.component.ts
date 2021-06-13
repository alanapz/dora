import { Component } from '@angular/core';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  readonly title = 'dora (the git explorer)';

  get readmeUrl() {
    return "https://github.com/alanapz/gitql/blob/develop/README.md"
  }

  get playgroundUrl() {
    return environment.endpointUrl;
  }
}

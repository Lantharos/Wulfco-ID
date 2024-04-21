import { Component, Input } from '@angular/core'

@Component({
  selector: 'authorized-app',
  templateUrl: 'authorized-app.component.html',
  styleUrls: ['authorized-app.component.css'],
})
export class AuthorizedApp {
  @Input()
  app_icon: string = 'https://play.teleporthq.io/static/svg/default-img.svg'
  @Input()
  app_about: string =
    'App is an app that adds stuff and is used by people and does stuff'
  @Input()
  app_name: string = 'Wulfco ID'
  @Input()
  rootClassName: string = ''
  constructor() {}
}

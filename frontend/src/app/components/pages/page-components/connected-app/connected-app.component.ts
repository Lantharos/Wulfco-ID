import { Component, Input } from '@angular/core'

@Component({
  selector: 'connected-app',
  templateUrl: 'connected-app.component.html',
  styleUrls: ['connected-app.component.css'],
})
export class ConnectedApp {
  @Input()
  image_src: string = 'https://play.teleporthq.io/static/svg/default-img.svg'
  @Input()
  rootClassName: string = ''
  @Input()
  username: string = '{appusername}'
  @Input()
  appname: string = '{appname}'
  constructor() {}
}

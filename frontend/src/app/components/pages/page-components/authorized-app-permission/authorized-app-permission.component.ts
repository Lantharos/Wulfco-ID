import { Component, Input } from '@angular/core'

@Component({
  selector: 'authorized-app-permission',
  templateUrl: 'authorized-app-permission.component.html',
  styleUrls: ['authorized-app-permission.component.css'],
})
export class AuthorizedAppPermission {
  @Input()
  rootClassName: string = ''
  @Input()
  permission: string = 'Access your third-party connections'
  constructor() {}
}

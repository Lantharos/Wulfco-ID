import { Component, Input } from '@angular/core'

@Component({
  selector: 'friend-request',
  templateUrl: 'friend-request.component.html',
  styleUrls: ['friend-request.component.css'],
})
export class FriendRequest {
  @Input()
  username: string = 'john_doe'
  @Input()
  avatar: string = 'https://play.teleporthq.io/static/svg/default-img.svg'
  constructor() {}
}

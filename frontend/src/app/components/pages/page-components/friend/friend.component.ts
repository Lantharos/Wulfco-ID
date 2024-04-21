import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-friend',
  templateUrl: 'friend.component.html',
  styleUrls: ['friend.component.css'],
})
export class Friend {
  @Input()
  avatar: string = 'https://play.teleporthq.io/static/svg/default-img.svg'
  @Input()
  username: string = 'john_doe'
  @Input()
  rootClassName: string = ''
  constructor() {}
}

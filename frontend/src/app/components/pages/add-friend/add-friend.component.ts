import { Component, Input } from '@angular/core'

@Component({
  selector: 'add-friend',
  templateUrl: 'add-friend.component.html',
  styleUrls: ['add-friend.component.css'],
})
export class AddFriend {
  @Input()
  rootClassName: string = ''
  constructor() {}
}

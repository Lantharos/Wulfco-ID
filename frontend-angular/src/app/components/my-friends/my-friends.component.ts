import { Component, Input } from '@angular/core'

@Component({
  selector: 'my-friends',
  templateUrl: 'my-friends.component.html',
  styleUrls: ['my-friends.component.css'],
})
export class MyFriends {
  @Input()
  rootClassName: string = ''
  constructor() {}
}

import { Component, Input } from '@angular/core'

@Component({
  selector: 'add-afriend',
  templateUrl: 'add-afriend.component.html',
  styleUrls: ['add-afriend.component.css'],
})
export class AddAFriend {
  @Input()
  rootClassName: string = ''
  constructor() {}
}

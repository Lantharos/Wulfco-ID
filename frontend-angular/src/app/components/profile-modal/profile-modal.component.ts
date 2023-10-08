import { Component, Input } from '@angular/core'

@Component({
  selector: 'profile-modal',
  templateUrl: 'profile-modal.component.html',
  styleUrls: ['profile-modal.component.css'],
})
export class ProfileModal {
  @Input()
  display_name: string = 'John Doe'
  @Input()
  username: string = 'john_doe'
  @Input()
  pronouns: string = 'he/him'
  @Input()
  profile_picture: string =
    'https://play.teleporthq.io/static/svg/default-img.svg'
  @Input()
  rootClassName: string = ''
  @Input()
  about_me: string = "There's nothing here :("
  constructor() {}
}

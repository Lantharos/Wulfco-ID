import { Component, Input } from '@angular/core'

@Component({
  selector: 'profile-modal',
  templateUrl: 'profile-modal.component.html',
  styleUrls: ['profile-modal.component.css'],
  inputs: ['display_name', 'username', 'banner_color', 'pronouns', 'profile_picture', 'rootClassName', 'about_me'],
})
export class ProfileModal {
  @Input()
  display_name: string = 'John Doe'
  @Input()
  username: string = 'john_doe'
  @Input()
  banner_color: string = '#fb3838'
  @Input()
  pronouns: string = 'he/him'
  @Input()
  profile_picture: string = 'https://play.teleporthq.io/static/svg/default-img.svg'
  @Input()
  rootClassName: string = ''
  @Input()
  about_me: string = "There\'s nothing here :("
  @Input()
  badges: any = []
  constructor() {
    this.badges.forEach(badge => {
       badge.badge_icon = `assets/badges/${badge.badge_id}`
     })

    this.badges.forEach(badge => {
        badge.badge_html = `<img src="${badge.badge_icon}" class="profile-modal-image1" alt="${badge.badge_name} badge icon" />`
    })
  }
}

import { Component, Input } from '@angular/core'

@Component({
  selector: 'connection-button',
  templateUrl: 'connection-button.component.html',
  styleUrls: ['connection-button.component.css'],
})
export class ConnectionButton {
  @Input()
  link_button: string = 'https://id.vikkivuk.xyz/connections/facebook/connect'
  @Input()
  image_src: string =
    'https://www.socialmediabutterflyblog.com/wp-content/uploads/sites/567/2021/01/Facebook-logo-500x350-1.png'
  @Input()
  image_alt: string = 'image'
  constructor() {}
}

import { Component, Input } from '@angular/core'

@Component({
  selector: 'security-key',
  templateUrl: 'security-key.component.html',
  styleUrls: ['security-key.component.css'],
})
export class SecurityKey {
  @Input()
  rootClassName: string = ''
  @Input()
  heading: string = 'A security key'
  constructor() {}
}

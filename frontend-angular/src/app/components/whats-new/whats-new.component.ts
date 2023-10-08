import { Component, Input } from '@angular/core'

@Component({
  selector: 'whats-new',
  templateUrl: 'whats-new.component.html',
  styleUrls: ['whats-new.component.css'],
})
export class WhatsNew {
  @Input()
  rootClassName: string = ''
  constructor() {}
}

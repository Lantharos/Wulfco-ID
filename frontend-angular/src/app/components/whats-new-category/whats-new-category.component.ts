import { Component, Input } from '@angular/core'

@Component({
  selector: 'whats-new-category',
  templateUrl: 'whats-new-category.component.html',
  styleUrls: ['whats-new-category.component.css'],
})
export class WhatsNewCategory {
  @Input()
  rootClassName: string = ''
  @Input()
  heading: string = 'WULFCO ID RELEASE'
  constructor() {}
}

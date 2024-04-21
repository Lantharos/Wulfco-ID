import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-subscriptions',
  templateUrl: 'subscriptions.component.html',
  styleUrls: ['subscriptions.component.css'],
})
export class Subscriptions {
  @Input()
  rootClassName: string = ''
  constructor() {}
}

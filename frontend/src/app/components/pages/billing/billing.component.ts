import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-billing',
  templateUrl: 'billing.component.html',
  styleUrls: ['billing.component.css'],
})
export class Billing {
  @Input()
  rootClassName: string = ''
  constructor() {}
}

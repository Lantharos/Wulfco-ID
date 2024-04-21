import { Component, Input } from '@angular/core'

@Component({
  selector: 'payment-method',
  templateUrl: 'payment-method.component.html',
  styleUrls: ['payment-method.component.css'],
})
export class PaymentMethod {
  @Input()
  name: string = 'Visa ending in 2978'
  @Input()
  logo: string = 'https://play.teleporthq.io/static/svg/default-img.svg'
  @Input()
  details: string = 'Expires Oct 2023'
  constructor() {}
}

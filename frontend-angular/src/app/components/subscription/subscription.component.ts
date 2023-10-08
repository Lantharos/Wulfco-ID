import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-subscription',
  templateUrl: 'subscription.component.html',
  styleUrls: ['subscription.component.css'],
})
export class Subscription {
  @Input()
  image_src: string = 'https://play.teleporthq.io/static/svg/default-img.svg'
  constructor() {}
}

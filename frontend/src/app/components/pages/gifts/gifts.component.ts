import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-gifts',
  templateUrl: 'gifts.component.html',
  styleUrls: ['gifts.component.css'],
})
export class Gifts {
  @Input()
  rootClassName: string = ''
  constructor() {}
}

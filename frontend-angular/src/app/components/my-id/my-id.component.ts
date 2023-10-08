import { Component, Input } from '@angular/core'

@Component({
  selector: 'my-id',
  templateUrl: 'my-id.component.html',
  styleUrls: ['my-id.component.css'],
})
export class MyID {
  @Input()
  rootClassName: string = ''
  constructor() {}
}

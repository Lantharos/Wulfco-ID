import { Component, Input } from '@angular/core'

@Component({
  selector: 'registration-finish',
  templateUrl: 'registration-finish.component.html',
  styleUrls: ['registration-finish.component.css'],
})
export class RegistrationFinish {
  @Input()
  rootClassName: string = ''
  constructor() {}
}

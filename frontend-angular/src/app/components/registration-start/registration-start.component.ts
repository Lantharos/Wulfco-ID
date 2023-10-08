import { Component, Input } from '@angular/core'

@Component({
  selector: 'registration-start',
  templateUrl: 'registration-start.component.html',
  styleUrls: ['registration-start.component.css'],
})
export class RegistrationStart {
  @Input()
  rootClassName: string = ''
  constructor() {}
}

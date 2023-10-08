import { Component, Input } from '@angular/core'

@Component({
  selector: 'registration-next',
  templateUrl: 'registration-next.component.html',
  styleUrls: ['registration-next.component.css'],
})
export class RegistrationNext {
  @Input()
  rootClassName: string = ''
  constructor() {}
}

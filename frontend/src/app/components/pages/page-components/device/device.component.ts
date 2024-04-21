import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-device',
  templateUrl: 'device.component.html',
  styleUrls: ['device.component.css'],
})
export class Device {
  @Input()
  device_type: string = 'WINDOWS •  CHROME'
  @Input()
  device_location: string = 'Belgrade, Belgrade, Serbia'
  @Input()
  rootClassName: string = ''
  constructor() {}
}

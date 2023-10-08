import { Component, Input } from '@angular/core'

@Component({
  selector: 'permission-category',
  templateUrl: 'permission-category.component.html',
  styleUrls: ['permission-category.component.css'],
})
export class PermissionCategory {
  @Input()
  description: string = 'Hyper Monthly'
  @Input()
  name: string = '06/07/2023'
  @Input()
  rootClassName: string = ''
  @Input()
  risklevel: string = '$9.99'
  constructor() {}
}

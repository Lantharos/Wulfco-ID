import {Component, Input} from '@angular/core'

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css'],
  inputs: ['userdata', 'getUserData'],
})
export class Profile {
  @Input()
  userdata: any
  @Input()
  getUserData: any

  constructor() {}

  fieldEdited (field: string, value: any) {
    this.userdata[field] = value.value
  }
}

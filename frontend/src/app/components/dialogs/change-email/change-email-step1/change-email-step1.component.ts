import { Component } from '@angular/core'
import {PopupService} from "../../../../popup-service/popup.service";

@Component({
  selector: 'change-email-step1',
  templateUrl: 'change-email-step1.component.html',
  styleUrls: ['change-email-step1.component.css'],
})
export class ChangeEmailStep1 {
  email:string = ''
  constructor(private dialog: PopupService) {}

  closeDialog() {
    this.dialog.close();
  }
}

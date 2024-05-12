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

  getValues() {
    return {}
  }

  startLoadingButton() {
    document.getElementById('send').setAttribute('disabled', 'true')
    document.getElementById('send-loader').innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    document.getElementById('send-text').style.display = 'none'
    document.getElementById('send-icon').style.display = 'none'
  }

  stopLoadingButton() {
    document.getElementById('send').removeAttribute('disabled')
    document.getElementById('send-text').style.display = 'inline-block'
    document.getElementById('send-loader').innerHTML = ''
    document.getElementById('send-icon').style.display = 'inline-block'
  }

  cancel() {
    this.dialog.cancel();
  }

  confirm() {
    this.startLoadingButton();
    this.dialog.confirm(this.stopLoadingButton);
  }
}

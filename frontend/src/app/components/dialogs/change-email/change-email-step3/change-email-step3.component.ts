import { Component } from '@angular/core'
import {PopupService} from "../../../../popup-service/popup.service";

@Component({
  selector: 'change-email-step3',
  templateUrl: 'change-email-step3.component.html',
  styleUrls: ['change-email-step3.component.css'],
})
export class ChangeEmailStep3 {
  constructor(private dialog: PopupService) {}

  getValues() {
    const email = <HTMLInputElement>(document.getElementById('email_new'))
    const password = <HTMLInputElement>(document.getElementById('password'))

    return {email: email.value, password: password.value}
  }

  startLoadingButton() {
    document.getElementById('confirm').setAttribute('disabled', 'true')
    document.getElementById('confirm-loader').innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    document.getElementById('confirm-text').style.display = 'none'
    document.getElementById('confirm-icon').style.display = 'none'
  }

  stopLoadingButton() {
    document.getElementById('confirm').removeAttribute('disabled')
    document.getElementById('confirm-text').style.display = 'inline-block'
    document.getElementById('confirm-loader').innerHTML = ''
    document.getElementById('confirm-icon').style.display = 'inline-block'
  }

  cancel() {
    this.dialog.cancel();
  }

  confirm() {
    this.startLoadingButton();
    this.dialog.confirm(this.stopLoadingButton);
  }
}

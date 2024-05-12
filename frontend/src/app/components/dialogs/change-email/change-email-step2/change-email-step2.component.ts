import { Component } from '@angular/core'
import {PopupService} from "../../../../popup-service/popup.service";

@Component({
  selector: 'change-email-step2',
  templateUrl: 'change-email-step2.component.html',
  styleUrls: ['change-email-step2.component.css'],
})
export class ChangeEmailStep2 {
  constructor(private dialog: PopupService) {}

  onChange(event: any) {
    sessionStorage.setItem('cc1tc', event)
  }

  getValues() {
    const code = sessionStorage.getItem('cc1tc').toLowerCase()
    sessionStorage.removeItem('cc1tc')

    return {code}
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

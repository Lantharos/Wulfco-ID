import {Component, EventEmitter, Input, Output} from '@angular/core'
import {MatSnackBar} from "@angular/material/snack-bar";
import {WulfcoSnackbar} from "../../../snackbar/wulfco-snackbar.component";

@Component({
  selector: 'registration-start',
  templateUrl: 'registration-start.component.html',
  styleUrls: ['registration-start.component.css'],
})
export class RegistrationStart {
  @Output() submit: EventEmitter<any> = new EventEmitter();
  constructor(private snackbar: MatSnackBar) {}

  submitForm() {
    if (!crypto.subtle) {
      alert('Your browser does not support the necessary encryption methods. Please use a different browser.')
      return
    }

    const email = document.getElementById('email') as HTMLInputElement
    const password = document.getElementById('password') as HTMLInputElement

    if (email.value === '' || password.value === '') {
      this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Please fill in all fields', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
      return
    }

    document.getElementById('next').setAttribute('disabled', 'true')
    document.getElementById('next-text').innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    document.getElementById('next-icon').style.display = 'none'
    this.submit.emit({stage: 1, email: email.value, password: password.value})
  }
}

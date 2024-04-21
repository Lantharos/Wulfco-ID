import {Component, EventEmitter, Output} from '@angular/core'
import {WulfcoSnackbar} from "../../../snackbar/wulfco-snackbar.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'registration-profile',
  templateUrl: 'registration-profile.component.html',
  styleUrls: ['registration-profile.component.css'],
})
export class RegistrationProfile {
  username = "john_doe"
  firstName = sessionStorage.getItem('firstName') ? sessionStorage.getItem('firstName') : 'John'

  @Output() submit: EventEmitter<any> = new EventEmitter();
  constructor(private snackbar: MatSnackBar) {}

  updateUsername(event: any) {
    const input = event.target
    var start = input.selectionStart;
    var end = input.selectionEnd;
    this.username = input.value.toLowerCase().replace(/\s/g, '_')
    input.setSelectionRange(start, end);
  }

  submitForm() {
    if (/^[a-z0-9_]*$/.test(this.username) === false) {
        this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Username is invalid!', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
        return
    }

    const display_name = document.getElementById('display_name') as HTMLInputElement

    if (display_name.value === '' || this.username === '') {
      this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Please fill in all fields!', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
      return
    }

    if (this.username.split(' ').length > 1) {
      this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'No spaces are allowed in usernames!', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
      return
    }

    document.getElementById('finish').setAttribute('disabled', 'true')
    document.getElementById('finish-text').innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    document.getElementById('finish-icon').style.display = 'none'
    this.submit.emit({stage: 4, display_name: display_name.value, username: this.username, picture: encodeURI('https://api.dicebear.com/5.x/identicon/svg?backgroundType=gradientLinear,solid&row1[]&row5[]&backgroundColor=ffd5dc,d1d4f9,c0aede,b6e3f4,ffdfbf&seed=' + this.username)})
  }

  protected readonly sessionStorage = sessionStorage;
  protected readonly JSON = JSON;
}

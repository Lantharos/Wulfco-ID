import {Component, EventEmitter, Input, Output} from '@angular/core'
import {MatSnackBar} from "@angular/material/snack-bar";
import {WulfcoSnackbar} from "../../../snackbar/wulfco-snackbar.component";

@Component({
  selector: 'registration-name',
  templateUrl: 'registration-name.component.html',
  styleUrls: ['registration-name.component.css'],
})
export class RegistrationName {
  @Output() submit: EventEmitter<any> = new EventEmitter();
  constructor(private snackbar: MatSnackBar) {}

  submitForm() {
    const name = document.getElementById('full_name') as HTMLInputElement
    const gender = document.getElementById('gender') as HTMLInputElement

    if (name.value === '' || gender.value === '') {
        this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Please fill in all fields!', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
        return
    }

    if (name.value.split(' ').length < 2) {
      this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Please enter your full name!', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
      return
    }

    document.getElementById('next').setAttribute('disabled', 'true')
    document.getElementById('next-text').innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    document.getElementById('next-icon').style.display = 'none'

    this.submit.emit({stage: 2, name: name.value, gender: gender.value})
  }
}

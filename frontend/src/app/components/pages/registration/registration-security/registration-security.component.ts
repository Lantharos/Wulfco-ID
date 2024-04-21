import {Component, EventEmitter, Input, Output} from '@angular/core'
import {WulfcoSnackbar} from "../../../snackbar/wulfco-snackbar.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'registration-security',
  templateUrl: 'registration-security.component.html',
  styleUrls: ['registration-security.component.css'],
})
export class RegistrationSecurity {
  @Output() submit: EventEmitter<any> = new EventEmitter();
  constructor(private snackbar: MatSnackBar) {}

  selectPersonal() {
    document.getElementById('personal').setAttribute('disabled', 'true')
    document.getElementById('personal-text').innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    document.getElementById('personal-icon').style.display = 'none'
    this.submit.emit({stage: 3, type: 'personal'})
  }

  selectBusiness() {
    document.getElementById('business').setAttribute('disabled', 'true')
    document.getElementById('personal-text').innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    document.getElementById('personal-icon').style.display = 'none'
    this.submit.emit({stage: 3, type: 'business'})
  }
}

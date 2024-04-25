import {Component, Input} from '@angular/core'
import {PopupService} from "../../../popup-service/popup.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgHcaptchaService} from "ng-hcaptcha";
import {CookieService} from "ngx-cookie-service";
import {WulfcoSnackbar} from "../../snackbar/wulfco-snackbar.component";
import { config } from '../../../config'
import {AuthCrypto} from "../../../util/AuthCrypto";

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

  constructor(private dialog: PopupService, private snackbar: MatSnackBar, private HCaptcha: NgHcaptchaService, private cookies: CookieService) {}

  fieldEdited(field: string, value: any) {
    this.userdata[field] = value.value
  }

  startLoadingButton(button: string) {
    document.getElementById(button).setAttribute('disabled', 'true')
    document.getElementById(button + '-loader').innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    document.getElementById(button + '-text').style.display = 'none'
    document.getElementById(button + '-icon').style.display = 'none'
  }

  stopLoadingButton(button: string) {
    document.getElementById(button).removeAttribute('disabled')
    document.getElementById(button + '-text').style.display = 'inline-block'
    document.getElementById(button + '-loader').innerHTML = ''
    document.getElementById(button + '-icon').style.display = 'inline-block'
  }

  pickAvatar() {
    document.getElementById('avatar').click()
  }

  async resetAvatar() {
    this.startLoadingButton("reset")

    const sessionSecret = new Uint8Array(decodeURIComponent(this.cookies.get('ss')).split(',').map(Number))
    const sessionToken = new Uint8Array(decodeURIComponent(this.cookies.get('st')).split(',').map(Number))
    const sessionId = this.cookies.get('sid')
    const sessionDoc = this.cookies.get('sd')
    const iv = new Uint8Array(decodeURIComponent(this.cookies.get('iv')).split(',').map(Number))

    if (sessionSecret === undefined || sessionToken === undefined || sessionId === '' || sessionDoc === '' || iv === undefined) {
      window.location.href = '/login'
    }

    const importedKey = await new AuthCrypto().ImportKey(sessionSecret)
    const ticket = await new AuthCrypto().AESEncrypt(JSON.stringify({token: sessionToken.toString()}), importedKey, iv)

    this.HCaptcha.verify().subscribe((res: any) => {
      if (res) {
        fetch(`${config.api_url}/avatar`, {
          method: "DELETE",
          headers: {
            "W-SessionID": JSON.stringify({sessionId, sessionDoc}),
            "W-Auth": ticket,
            "W-Reason": "avatar",
            "W-HCaptcha": res
          }
        }).then((res) => {
          res.json().then((data) => {
            if (data.success) {
              this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Avatar reset!', type: 'success', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
              this.getUserData()
              this.stopLoadingButton("reset")
            } else {
              this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Failed to reset avatar!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
              this.stopLoadingButton("reset")
            }
          })
        }).catch(() => {
            this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Failed to reset avatar!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
            this.stopLoadingButton("reset")
        })
      }
    })
  }

  changeAvatar(e) {
    const file = e.target.files[0]
    if (!file) return

    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

    if (!allowedExtensions.exec(file.name)) {
      this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'File must be a .jpg, .jpeg, or .png!', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
      e.target.value = '';
      return
    }

    if (file.size < 2097152) {
      const reader = new FileReader();

      reader.onload = async (e2) => {
        const base64String = reader.result.toString().split(',')[1];
        const jsonData = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          data: base64String
        };

        this.startLoadingButton("upload")

        const sessionSecret = new Uint8Array(decodeURIComponent(this.cookies.get('ss')).split(',').map(Number))
        const sessionToken = new Uint8Array(decodeURIComponent(this.cookies.get('st')).split(',').map(Number))
        const sessionId = this.cookies.get('sid')
        const sessionDoc = this.cookies.get('sd')
        const iv = new Uint8Array(decodeURIComponent(this.cookies.get('iv')).split(',').map(Number))

        if (sessionSecret === undefined || sessionToken === undefined || sessionId === '' || sessionDoc === '' || iv === undefined) {
          window.location.href = '/login'
        }

        const importedKey = await new AuthCrypto().ImportKey(sessionSecret)
        const ticket = await new AuthCrypto().AESEncrypt(JSON.stringify({token: sessionToken.toString()}), importedKey, iv)

        this.HCaptcha.verify().subscribe((res: any) => {
          if (res) {
            fetch(`${config.api_url}/avatar`, {
              method: "POST",
              headers: {
                "W-SessionID": JSON.stringify({sessionId, sessionDoc}),
                "W-Auth": ticket,
                "W-Reason": "avatar",
                "W-HCaptcha": res,
                "Content-Type": "application/json"
              },
              body: JSON.stringify(jsonData)
            }).then((res) => {
              res.json().then((data) => {
                if (data.success) {
                  this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Avatar uploaded!', type: 'success', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                  this.getUserData()
                  this.stopLoadingButton("upload")
                } else {
                  this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Failed to upload!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                  this.stopLoadingButton("upload")
                }
              })
            }).catch(() => {
              this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Failed to upload!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
              this.stopLoadingButton("upload")
            })
          }
        })
      }

      reader.readAsDataURL(file);
      e.target.value = '';
    } else {
      e.target.value = '';
      this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'File must be less than 2MB!', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
    }
  }
}

import { Component, Input } from '@angular/core'
import {EditUsername} from "../../dialogs/edit-username/edit-username.component";
import {PopupService} from "../../../popup-service/popup.service";
import {ComponentType} from "@angular/cdk/overlay";
import {ChangeEmailStep1} from "../../dialogs/change-email/change-email-step1/change-email-step1.component";
import {EditBirthday} from "../../dialogs/edit-birthday/edit-birthday.component";
import {EditName} from "../../dialogs/edit-name/edit-name.component";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {WulfcoSnackbar} from "../../snackbar/wulfco-snackbar.component";
import {NgHcaptchaService} from "ng-hcaptcha";
import {CookieService} from "ngx-cookie-service";
import {AuthCrypto} from "../../../util/AuthCrypto";
import { config } from '../../../config'

@Component({
  selector: 'my-id',
  templateUrl: 'my-id.component.html',
  styleUrls: ['my-id.component.css'],
  inputs: ['userdata', 'getUserData'],
})
export class MyID {
  @Input()
  userdata: any
  @Input()
  getUserData: any

  constructor(private dialog: PopupService, private snackbar: MatSnackBar, private HCaptcha: NgHcaptchaService, private cookies: CookieService) {}

  openDialog(dialog: ComponentType<unknown>) {
      this.dialog.open(dialog, async(values: object, stopLoadingButton: () => void) => {
        let data = {}
        let endpoint = ''
        let passwordHash = ''
        if (dialog == EditName) {
          const name = values["name"]
          const password = values["password"]

          if (name === '' || password === '') {
            this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Please fill in all fields', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
            stopLoadingButton()
            return
          }

          if (name === this.userdata.name) {
            this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Name is the same!', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
            stopLoadingButton()
            return
          }

          if (name.split(' ').length < 1) {
            this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Please enter your full name!', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
            stopLoadingButton()
            return
          }

          data['name'] = name
          passwordHash = await new AuthCrypto().Hash(password)
          endpoint = '/change-name'
        } else if (dialog == EditUsername) {
            const username = values["username"]
            const password = values["password"]

            if (username === '' || password === '') {
                this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Please fill in all fields', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                stopLoadingButton()
                return
            }

            if (username === this.userdata.username) {
                this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Username is the same!', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                stopLoadingButton()
                return
            }

            if (username.length < 3) {
                this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Username must be at least 3 characters long!', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                stopLoadingButton()
                return
            }

            data['username'] = username
            passwordHash = await new AuthCrypto().Hash(password)
            endpoint = '/change-username'
        } else if (dialog == EditBirthday) {
            const birthday = values["birthday"]
            const password = values["password"]

            if (birthday === '' || password === '') {
                this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Please fill in all fields', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                stopLoadingButton()
                return
            }

            data['birthday'] = birthday
            passwordHash = await new AuthCrypto().Hash(password)
            endpoint = '/change-birthday'
        }

        const sessionSecret = new Uint8Array(decodeURIComponent(this.cookies.get('ss')).split(',').map(Number))
        const sessionToken = new Uint8Array(decodeURIComponent(this.cookies.get('st')).split(',').map(Number))
        const sessionId = this.cookies.get('sid')
        const sessionDoc = this.cookies.get('sd')
        const iv = new Uint8Array(decodeURIComponent(this.cookies.get('iv')).split(',').map(Number))

        if (sessionSecret === undefined || sessionToken === undefined || sessionId === '' || sessionDoc === '' || iv === undefined) {
          window.location.href = '/login'
        }

        const importedKey = await new AuthCrypto().ImportKey(sessionSecret)
        const ticket = await new AuthCrypto().AESEncrypt(JSON.stringify({ token: sessionToken.toString() }), importedKey, iv)

        const encryptedData = await new AuthCrypto().SimpleEncrypt(JSON.stringify({ ...data, password: passwordHash }))

        this.HCaptcha.verify().subscribe((res: any) => {
          if (res) {
            fetch(config.api_url + endpoint, {method: 'POST', headers: {
                "W-SessionID": JSON.stringify({ sessionId, sessionDoc }),
                "W-Auth": ticket,
                "W-Reason": endpoint.replace('/', ''),
                "W-HCaptcha": res,
                "Content-Type": "application/json"
              }, body: JSON.stringify(encryptedData) }).then(async (res) => {
              if (res.status === 200) {
                this.dialog.close()
                if (dialog == EditUsername) {
                    const sdata = await res.json()

                    const encryptedSessionData = new Uint8Array(sdata.session.split(',').map(Number))
                    const iv = new Uint8Array(sdata.iv.split(',').map(Number))
                    const key = await new AuthCrypto().KDF(passwordHash, data["username"])

                    const sessionDataRaw = await new AuthCrypto().AESDecrypt(encryptedSessionData, key, iv)
                    const sessionData = JSON.parse(sessionDataRaw)

                    this.cookies.set('ss', sessionData.secret, {expires: 1})
                    this.cookies.set('st', sessionData.token, {expires: 1})
                    this.cookies.set('sid', sessionData.id, {expires: 1})
                    this.cookies.set('sd', sessionData.sessionDoc, {expires: 1})
                    this.cookies.set('iv', sdata.iv, {expires: 1})

                    this.getUserData()
                    this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Username Updated!', type: 'success', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                } else {
                  this.getUserData()
                  this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Data Updated!', type: 'success', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                }
              } else {
                stopLoadingButton()
                this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'An error occured!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
              }
            })
          } else {
            stopLoadingButton()
            this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Captcha Failed!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
          }
        })
      })
  }

  protected readonly EditUsername = EditUsername;
  protected readonly ChangeEmailStep1 = ChangeEmailStep1;
  protected readonly EditBirthday = EditBirthday;
  protected readonly EditName = EditName;
}

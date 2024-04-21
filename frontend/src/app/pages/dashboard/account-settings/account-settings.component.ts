import {Component, OnInit} from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'
import {config} from "../../../config";
import {CookieService} from "ngx-cookie-service";
import {AuthCrypto} from "../../../util/AuthCrypto";
import {WulfcoSnackbar} from "../../../components/snackbar/wulfco-snackbar.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgHcaptchaService} from "ng-hcaptcha";

@Component({
  selector: 'account-settings',
  templateUrl: 'account-settings.component.html',
  styleUrls: ['account-settings.component.css'],
})
export class AccountSettings implements OnInit {
  public userData: object;
  loading: boolean = true
  selectedPage: string = 'id'
  constructor(private title: Title, private meta: Meta, private snackbar: MatSnackBar, private HCaptcha: NgHcaptchaService, private cookies: CookieService) {
    this.title.setTitle('ID Settings')
    this.meta.addTags([{name: 'description', content: 'Wulfco ID is a place where you can create one ID that you will use for all of the services created by Wulfco LLC.',}, {property: 'og:title', content: 'Wulfco ID',}, {property: 'og:description', content: 'Wulfco ID is a place where you can create one ID that you will use for all of the services created by Wulfco LLC.',}])
    this.userData = config.default_user_data
  }

  selectPage = (page: string) => {
    this.selectedPage = page
  }

  getUserData = async () => {
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

    this.HCaptcha.verify().subscribe((res: any) => {
      if (res) {
        fetch(config.api_url + '/user', {method: 'GET', headers: {
            "W-SessionID": JSON.stringify({ sessionId, sessionDoc }),
            "W-Auth": ticket,
            "W-Reason": "get-user-data",
            "W-HCaptcha": res,
          }}).then(async (res) => {
          if (res.status === 200) {
            const data = await res.json()
            const encryptedUserData = new Uint8Array(data.data.split(',').map(Number))
            const userDataRaw = await new AuthCrypto().AESDecrypt(encryptedUserData, importedKey, iv)

            this.userData = JSON.parse(userDataRaw)
            this.loading = false
          } else {
            this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'An error occured!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
          }
        })
      } else {
        this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Captcha Failed!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
      }
    })
  }

  async ngOnInit() {
    await this.getUserData();
  }
}

import {Component} from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'
import {AuthCrypto} from "../../util/AuthCrypto";
import { NgHcaptchaService } from "ng-hcaptcha"
import {config} from "../../config";
import {MatSnackBar} from "@angular/material/snack-bar";
import {WulfcoSnackbar} from "../../components/snackbar/wulfco-snackbar.component";
import {CookieService} from "ngx-cookie-service";
const AH = new AuthCrypto()

@Component({
  selector: 'create-id',
  templateUrl: 'create-id.component.html',
  styleUrls: ['create-id.component.css'],
})
export class CreateId {
  stage: number = 1
  encryptionKey: CryptoKey
  iv: Uint8Array
  constructor(private title: Title, private meta: Meta, private snackbar: MatSnackBar, private HCaptcha: NgHcaptchaService, private cookies: CookieService) {
    AH.GenerateAESKey().then((key: CryptoKey) => {
        this.encryptionKey = key
        this.iv = new Uint8Array(16)
    })
    this.title.setTitle('Create an ID')
    this.meta.addTags([{name: 'description', content: "Don't have an ID? No worries! Just create one, today, for free.",}, {property: 'og:title', content: 'Create an Account',}, {property: 'og:description', content: 'Wulfco ID is a place where you can create one ID that you will use for all of the services created by Wulfco LLC.',}, {property: 'og:image', content: 'https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/70dc84ed-902e-47ba-a9d3-d75e24c32e1d?org_if_sml=1',},])
  }

  async prepareData(data: any) {
    const oldEncryptedData = sessionStorage.getItem('wulfco_id')
    const oldData = JSON.parse(await AH.AESDecrypt(new Uint8Array(oldEncryptedData.split(",").map(Number)), this.encryptionKey, this.iv))

    const jsonData = await AH.AESEncrypt(JSON.stringify({...oldData, ...data}), this.encryptionKey, this.iv);
    sessionStorage.setItem('wulfco_id', jsonData)
  }

  async submit(data: any) {
    if (data.stage === 1) {
      const jsonData = JSON.stringify({ email: data.email, password: await AH.Hash(data.password) })
      const oldData = sessionStorage.getItem('wulfco_id')
      if (oldData) {
        sessionStorage.removeItem('wulfco_id')
      }

      const encryptedData = await AH.AESEncrypt(jsonData, this.encryptionKey, this.iv)
      sessionStorage.setItem('wulfco_id', encryptedData)

      this.stage = 2
    } else if (data.stage === 2) {
      await this.prepareData(data)
      sessionStorage.setItem('firstName', data.name.split(" ")[0])

      this.stage = 3
    } else if (data.stage === 3) {
      await this.prepareData(data)

      this.stage = 4
    } else if (data.stage === 4) {
      const oldEncryptedData = sessionStorage.getItem('wulfco_id')
      const oldData = JSON.parse(await AH.AESDecrypt(new Uint8Array(oldEncryptedData.split(",").map(Number)), this.encryptionKey, this.iv))
      const encryptedData = await new AuthCrypto().SimpleEncrypt(JSON.stringify({...oldData, ...data})).catch(() => {
        this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'An error occured!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
        document.getElementById('finish').removeAttribute('disabled')
        document.getElementById('finish-text').innerHTML = 'Finish Registration'
        document.getElementById('finish-icon').style.display = 'inline-block'
      })

      this.HCaptcha.verify().subscribe((res: any) => {
        if (res) {
          fetch(config.api_url + "/register", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({...encryptedData, hcaptcha: res}) }).then(async resData => {
            if (resData.status === 200) {
              resData.json().then((dataRes: any) => {
                if (dataRes.success) {
                  console.log(dataRes)
                  this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Your ID has been created!', type: 'success', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                  setTimeout(() => {
                    this.cookies.set('id', dataRes.uuid)
                    window.location.href = "/verify-email"
                    sessionStorage.removeItem('wulfco_id')
                    sessionStorage.removeItem('firstName')
                  }, 6000)
                } else {
                  document.getElementById('finish').removeAttribute('disabled')
                  document.getElementById('finish-text').innerHTML = 'Finish Registration'
                  document.getElementById('finish-icon').style.display = 'inline-block'
                  this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: "An error occured!", type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                }
              })
            } else if (resData.status === 429) {
              this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'You can only make 5 IDs per day!', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
              setTimeout(() => {
                window.location.href = "/login"
              }, 6000)
            } else if (resData.status === 400) {
              const dataRes = await resData.json()
              if (dataRes.error === "username_taken") {
                this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Username is taken!', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                document.getElementById('finish').removeAttribute('disabled')
                document.getElementById('finish-text').innerHTML = 'Finish Registration'
                document.getElementById('finish-icon').style.display = 'inline-block'
              }
            } else {
              this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'An unknown error occured', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
              document.getElementById('finish').removeAttribute('disabled')
              document.getElementById('finish-text').innerHTML = 'Finish Registration'
              document.getElementById('finish-icon').style.display = 'inline-block'
            }
          })
        } else {
          document.getElementById('finish').removeAttribute('disabled')
          document.getElementById('finish-text').innerHTML = 'Finish Registration'
          document.getElementById('finish-icon').style.display = 'inline-block'
          this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Captcha Failed!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
        }
      })
    }
  }
}

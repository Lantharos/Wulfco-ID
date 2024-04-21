import { Component } from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgHcaptchaService} from "ng-hcaptcha";
import {CookieService} from "ngx-cookie-service";
import {config} from "../../../config";
import {WulfcoSnackbar} from "../../../components/snackbar/wulfco-snackbar.component";

@Component({
  selector: 'verify-email',
  templateUrl: 'verify-email.component.html',
  styleUrls: ['verify-email.component.css'],
})
export class VerifyEmail {
  code: string = ''
  constructor(private title: Title, private meta: Meta, private snackbar: MatSnackBar, private HCaptcha: NgHcaptchaService, private cookies: CookieService) {
    this.title.setTitle('Verify Email')
    this.meta.addTags([{name: 'description', content: 'Wulfco ID is a place where you can create one ID that you will use for all of the services created by Wulfco.',}, {property: 'og:title', content: 'Verify Email',}, {property: 'og:description', content: 'Wulfco ID is a place where you can create one ID that you will use for all of the services created by Wulfco.',}, {property: 'og:image', content: 'https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/70dc84ed-902e-47ba-a9d3-d75e24c32e1d?org_if_sml=1',},])
  }

  onChange(event: any) {
    this.code = event
  }

  submit() {
    document.getElementById('submit').setAttribute('disabled', 'true')
    document.getElementById('submit-text').innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    document.getElementById('submit-icon').style.display = 'none'
    const code = this.code.toLowerCase()
    const id = this.cookies.get('id')

    this.HCaptcha.verify().subscribe((res: any) => {
      if (res) {
        fetch(config.api_url + "/verify-email", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, id }) }).then(async (res) => {
          if (res.status === 200) {
            this.snackbar.openFromComponent(WulfcoSnackbar, {
              data: {
                message: 'Your email has been verified!',
                type: 'success',
                totalTime: 5000
              }, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],
            });
            setTimeout(() => {
              window.location.href = '/login'
            }, 6000)
          } else if (res.status === 429) {
            this.snackbar.openFromComponent(WulfcoSnackbar, {
              data: {
                message: 'Too many requests!',
                type: 'warning',
                totalTime: 5000
              }, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],
            });
            setTimeout(() => {
              window.location.href = '/login'
            }, 6000)
          } else {
            document.getElementById('submit').removeAttribute('disabled')
            document.getElementById('submit-text').innerHTML = 'Verify'
            document.getElementById('submit-icon').style.display = 'inline-block'
            this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'An error occured!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
          }
        })
      } else {
        document.getElementById('submit').removeAttribute('disabled')
        document.getElementById('submit-text').innerHTML = 'Verify'
        document.getElementById('submit-icon').style.display = 'inline-block'
        this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Captcha Failed!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
      }
    })
  }

  protected readonly onsubmit = onsubmit;
}

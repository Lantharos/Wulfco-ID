import {Component, OnInit} from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'
import { HttpClient } from '@angular/common/http';
import { NgToastService } from "ng-angular-popup";
import { config } from '../../../config'
import {CookieService} from "ngx-cookie-service";
import {NgHcaptchaService} from "ng-hcaptcha";
import {MatSnackBar} from "@angular/material/snack-bar";
import {WulfcoSnackbar} from "../../../components/snackbar/wulfco-snackbar.component";
import {AuthCrypto} from "../../../util/AuthCrypto";

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class Login implements OnInit {
    raw7mql: string = ' '
    constructor(private title: Title, private meta: Meta, private snackbar: MatSnackBar, private HCaptcha: NgHcaptchaService, private cookies: CookieService) {
        this.title.setTitle('Log In')
        this.meta.addTags([{name: 'description', content: 'Log in to your ID',}, {property: 'og:title', content: 'Log In',}, {property: 'og:description', content: 'Log in to your ID.',}, {property: 'og:image', content: 'https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/70dc84ed-902e-47ba-a9d3-d75e24c32e1d?org_if_sml=1',},])
    }

    ngOnInit() {
        if (this.cookies.get('ss') && this.cookies.get('st') && this.cookies.get('sid') && this.cookies.get('sd') && this.cookies.get('iv')) {
            window.location.href = '/summary'
        }
    }

    login = async(event: any) => {
        event.preventDefault()
        const username = (<HTMLInputElement>document.getElementById('username')).value
        const password = (<HTMLInputElement>document.getElementById('password')).value

        const passwordHash = await new AuthCrypto().Hash(password)

        if (username === '' || password === '') {
            this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Please fill in all fields', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
            return
        }

        document.getElementById('login').setAttribute('disabled', 'true')
        document.getElementById('login-text').innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'
        document.getElementById('login-icon').style.display = 'none'

        const encryptedData = await new AuthCrypto().SimpleEncrypt(JSON.stringify({username, passwordHash}))

        this.HCaptcha.verify().subscribe((res: any) => {
            if (res) {
                fetch(config.api_url + '/login', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ ...encryptedData, hcaptcha: res })}).then(async (res) => {
                    if (res.status === 200) {
                        const data = await res.json()

                        const encryptedSessionData = new Uint8Array(data.session.split(',').map(Number))
                        const iv = new Uint8Array(data.iv.split(',').map(Number))
                        const key = await new AuthCrypto().KDF(passwordHash, username)

                        const sessionDataRaw = await new AuthCrypto().AESDecrypt(encryptedSessionData, key, iv)
                        const sessionData = JSON.parse(sessionDataRaw)

                        this.cookies.set('ss', sessionData.secret, {expires: 1})
                        this.cookies.set('st', sessionData.token, {expires: 1})
                        this.cookies.set('sid', sessionData.id, {expires: 1})
                        this.cookies.set('sd', sessionData.sessionDoc, {expires: 1})
                        this.cookies.set('iv', data.iv, {expires: 1})

                        this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Logged in!', type: 'success', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});

                        setTimeout(() => {
                            window.location.href = '/summary'
                            this.cookies.delete('id')
                        }, 6000)
                    } else if (res.status === 400) {
                        const data = await res.json()
                        if (data.error === "email_not_verified") {
                            this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Email not verified', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                            setTimeout(() => {
                                this.cookies.set('id', data.uuid)
                                window.location.href = '/verify-email'
                            }, 6000)
                        } else if (data.error === "invalid_password") {
                            this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Invalid password!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                            document.getElementById('login').removeAttribute('disabled')
                            document.getElementById('login-text').innerHTML = 'Log In'
                            document.getElementById('login-icon').style.display = 'inline-block'
                        } else if (data.error === "invalid_username") {
                            this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Invalid username', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                            document.getElementById('login').removeAttribute('disabled')
                            document.getElementById('login-text').innerHTML = 'Log In'
                            document.getElementById('login-icon').style.display = 'inline-block'
                        }
                    } else {
                        this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'An error occurred', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                        document.getElementById('login').removeAttribute('disabled')
                        document.getElementById('login-text').innerHTML = 'Log In'
                        document.getElementById('login-icon').style.display = 'inline-block'
                    }
                })
            } else {
                this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Please complete the captcha', type: 'warning', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                document.getElementById('login').removeAttribute('disabled')
                document.getElementById('login-text').innerHTML = 'Log In'
                document.getElementById('login-icon').style.display = 'inline-block'
            }
        })
    }
}

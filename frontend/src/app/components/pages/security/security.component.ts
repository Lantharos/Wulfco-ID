import {Component, Input} from '@angular/core'
import {PopupService} from "../../../popup-service/popup.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgHcaptchaService} from "ng-hcaptcha";
import {CookieService} from "ngx-cookie-service";
import {AuthCrypto} from "../../../util/AuthCrypto";
import {WulfcoSnackbar} from "../../snackbar/wulfco-snackbar.component";
import {config} from "../../../config";
import {NameSecurityKey} from "../../dialogs/name-security-key/name-security-key.component";

@Component({
  selector: 'app-security',
  templateUrl: 'security.component.html',
  styleUrls: ['security.component.css'],
})
export class Security {
  @Input()
  userdata: any
  @Input()
  getUserData: any

  constructor(private dialog: PopupService, private snackbar: MatSnackBar, private HCaptcha: NgHcaptchaService, private cookies: CookieService) {}

  registerSecurityKey = async () => {
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

    const challenge = await fetch(config.api_url + '/security-key', {
      method: 'GET',
      headers: {
        "W-SessionID": JSON.stringify({sessionId, sessionDoc}),
        "W-Auth": ticket,
        "W-Reason": "get-challenge",
      }
    }).then(async (res) => {
      if (res.status === 200) {
        return await res.json();
      } else {
        this.snackbar.openFromComponent(WulfcoSnackbar, {
          data: {
            message: 'An error occured!',
            type: 'error',
            totalTime: 5000
          }, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],
        });

        return null;
      }
    });

    try {
      const credential = <PublicKeyCredential>await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(decodeURIComponent(challenge).split(',').map(Number)),
          rp: {
            id: window.location.hostname,
            name: "Wulfco ID"
          },
          user: {
            id: new Uint8Array(16),
            name: this.userdata.username,
            displayName: this.userdata.profile.display_name
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }],
          timeout: 60000,
          attestation: "none",
          authenticatorSelection: {
            authenticatorAttachment: "cross-platform",
            userVerification: "required"
          }
        }
      });

      if (credential) {
        const credentialResponse = <AuthenticatorAttestationResponse>credential.response;
        const attestationObject = credentialResponse.attestationObject
        const clientDataJSON = credentialResponse.attestationObject

        const securityKey = {
          id: credential.id,
          rawId: credential.rawId,
          response: { attestationObject, clientDataJSON },
          type: credential.type
        }

        const encryptedKey = await new AuthCrypto().AESEncrypt(JSON.stringify(securityKey), importedKey, iv)
        const senderObject = await new AuthCrypto().SimpleEncrypt(JSON.stringify(encryptedKey))

        this.dialog.open(NameSecurityKey, (values, stopLoadingButton) => {
          this.HCaptcha.verify().subscribe((res: any) => {
            if (res) {
              fetch(config.api_url + '/security-key', {
                method: 'POST',
                headers: {
                  "W-SessionID": JSON.stringify({ sessionId, sessionDoc }),
                  "W-Auth": ticket,
                  "W-Reason": "register-security-key",
                  "W-HCaptcha": res,
                },
                body: JSON.stringify({
                  senderObject,
                  name: values['name'],
                })
              }).then(async (res) => {
                if (res.status === 200) {
                  const data = await res.json()
                  if (data.success) {
                    this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Security key registered!', type: 'success', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                    this.dialog.close()
                    stopLoadingButton()
                  } else {
                    this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'An error occured!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                    stopLoadingButton()
                  }
                } else {
                  this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'An error occured!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
                  stopLoadingButton()
                }
              })
            } else {
              this.snackbar.openFromComponent(WulfcoSnackbar, {data: {message: 'Captcha Failed!', type: 'error', totalTime: 5000}, duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['wulfco-snackbar'],});
              stopLoadingButton()
            }
          })
        })
      } else {
        // Handle case where user didn't select a security key
      }
    } catch (error) {
      console.error("Error registering security key:", error);
      // Handle error
    }
  };

}

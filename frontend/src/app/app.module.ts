import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http';

import { ComponentsModule } from './components/components.module'
import { AppComponent } from './app.component'
import { NgToastModule } from "ng-angular-popup";
import { CookieService } from 'ngx-cookie-service';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { config } from "./config";
import {PopupService} from "./popup-service/popup.service";
import {PopupModule} from "./popup-service/popup.module";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NgOtpInputModule } from  'ng-otp-input';

const routes = [
  {
    path: 'reset-password',
    loadChildren: () =>
        import('./pages/password/reset-password/reset-password.module').then(
            (m) => m.ResetPasswordModule
        ),
  },
  {
    path: 'summary',
    loadChildren: () =>
        import('./pages/dashboard/summary/summary.module').then((m) => m.SummaryModule),
  },
  {
    path: 'account-settings',
    loadChildren: () =>
        import('./pages/dashboard/account-settings/account-settings.module').then(
            (m) => m.AccountSettingsModule
        ),
  },
  {
    path: '',
    loadChildren: () =>
        import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'coming-soon',
    loadChildren: () =>
        import('./pages/coming-soon/coming-soon.module').then(
            (m) => m.ComingSoonModule
        ),
  },
  {
    path: 'create-id',
    loadChildren: () =>
        import('./pages/create-id/create-id.module').then(
            (m) => m.CreateIdModule
        ),
  },
  {
    path: 'change-password',
    loadChildren: () =>
        import('./pages/password/change-password/change-password.module').then(
            (m) => m.ChangePasswordModule
        ),
  },
  {
    path: 'verify-email',
    loadChildren: () =>
        import('./pages/login/verify-email/verify-email.module').then(
            (m) => m.VerifyEmailModule
        ),
  },
  {
    path: 'login',
    loadChildren: () =>
        import('./pages/login/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'authorize',
    loadChildren: () =>
        import('./pages/dashboard/authorize/authorize.module').then(
            (m) => m.AuthorizeModule
        ),
  },
  {
    path: '**',
    loadChildren: () =>
        import('./pages/not-found/not-found.module').then(
            (m) => m.NotFoundModule
        ),
  },
]

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ComponentsModule,
    HttpClientModule,
    NgToastModule,
    NgHcaptchaModule.forRoot({siteKey: config.hcaptcha_key}),
    NgxSkeletonLoaderModule.forRoot(),
    MatDialogModule,
    BrowserAnimationsModule,
    PopupModule,
    MatSnackBarModule,
    NgOtpInputModule,
  ],
  providers: [CookieService, PopupService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

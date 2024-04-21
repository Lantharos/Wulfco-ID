import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { ComponentsModule } from '../../../components/components.module'
import { AccountSettings } from './account-settings.component'
import {NgHcaptchaModule} from "ng-hcaptcha";

const routes = [
  {
    path: '',
    component: AccountSettings,
  },
]

@NgModule({
  declarations: [AccountSettings],
    imports: [CommonModule, ComponentsModule, RouterModule.forChild(routes), NgHcaptchaModule],
  exports: [AccountSettings],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountSettingsModule {}

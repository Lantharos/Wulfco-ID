import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { ComponentsModule } from '../../../components/components.module'
import { Login } from './login.component'
import {NgHcaptchaModule} from "ng-hcaptcha";

const routes = [
  {
    path: '',
    component: Login,
  },
]

@NgModule({
  declarations: [Login],
    imports: [CommonModule, ComponentsModule, RouterModule.forChild(routes), NgHcaptchaModule],
  exports: [Login],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginModule {}

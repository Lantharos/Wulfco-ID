import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { ComponentsModule } from '../../components/components.module'
import { ResetPassword } from './reset-password.component'

const routes = [
  {
    path: '',
    component: ResetPassword,
  },
]

@NgModule({
  declarations: [ResetPassword],
  imports: [CommonModule, ComponentsModule, RouterModule.forChild(routes)],
  exports: [ResetPassword],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ResetPasswordModule {}

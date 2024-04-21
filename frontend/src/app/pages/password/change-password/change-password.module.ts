import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { ComponentsModule } from '../../../components/components.module'
import { ChangePassword } from './change-password.component'

const routes = [
  {
    path: '',
    component: ChangePassword,
  },
]

@NgModule({
  declarations: [ChangePassword],
  imports: [CommonModule, ComponentsModule, RouterModule.forChild(routes)],
  exports: [ChangePassword],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChangePasswordModule {}

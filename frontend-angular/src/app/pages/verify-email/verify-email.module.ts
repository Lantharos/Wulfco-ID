import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { ComponentsModule } from '../../components/components.module'
import { VerifyEmail } from './verify-email.component'

const routes = [
  {
    path: '',
    component: VerifyEmail,
  },
]

@NgModule({
  declarations: [VerifyEmail],
  imports: [CommonModule, ComponentsModule, RouterModule.forChild(routes)],
  exports: [VerifyEmail],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VerifyEmailModule {}

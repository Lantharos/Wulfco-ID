import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { ComponentsModule } from '../../../components/components.module'
import { Authorize } from './authorize.component'

const routes = [
  {
    path: '',
    component: Authorize,
  },
]

@NgModule({
  declarations: [Authorize],
  imports: [CommonModule, ComponentsModule, RouterModule.forChild(routes)],
  exports: [Authorize],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthorizeModule {}

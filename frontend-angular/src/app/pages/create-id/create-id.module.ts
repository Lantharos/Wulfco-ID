import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { ComponentsModule } from '../../components/components.module'
import { CreateId } from './create-id.component'

const routes = [
  {
    path: '',
    component: CreateId,
  },
]

@NgModule({
  declarations: [CreateId],
  imports: [CommonModule, ComponentsModule, RouterModule.forChild(routes)],
  exports: [CreateId],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreateIdModule {}

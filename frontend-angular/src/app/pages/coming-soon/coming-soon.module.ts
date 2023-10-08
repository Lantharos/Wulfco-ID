import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { ComponentsModule } from '../../components/components.module'
import { ComingSoon } from './coming-soon.component'

const routes = [
  {
    path: '',
    component: ComingSoon,
  },
]

@NgModule({
  declarations: [ComingSoon],
  imports: [CommonModule, ComponentsModule, RouterModule.forChild(routes)],
  exports: [ComingSoon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComingSoonModule {}

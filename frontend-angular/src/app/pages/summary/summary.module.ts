import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { ComponentsModule } from '../../components/components.module'
import { Summary } from './summary.component'

const routes = [
  {
    path: '',
    component: Summary,
  },
]

@NgModule({
  declarations: [Summary],
  imports: [CommonModule, ComponentsModule, RouterModule.forChild(routes)],
  exports: [Summary],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SummaryModule {}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import {CommonModule, NgOptimizedImage} from '@angular/common'

import { ComponentsModule } from '../../../components/components.module'
import { Summary } from './summary.component'
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {NgHcaptchaModule} from "ng-hcaptcha";

const routes = [
  {
    path: '',
    component: Summary,
  },
]

@NgModule({
  declarations: [Summary],
    imports: [CommonModule, ComponentsModule, RouterModule.forChild(routes), NgxSkeletonLoaderModule, NgOptimizedImage, NgHcaptchaModule],
  exports: [Summary],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SummaryModule {}

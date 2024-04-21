import {OverlayModule} from '@angular/cdk/overlay';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {PopupService} from './popup.service';
import {DialogComponent} from "./dialog-component/dialog.component";

@NgModule({
  declarations: [
    DialogComponent
  ],
  imports: [
    CommonModule,
    OverlayModule
  ],
  exports: [],
  providers: [PopupService]
})
export class PopupModule { }

import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { DialogComponent } from './dialog-component/dialog.component';
import { OVERLAY_REF, OVERLAY_COMPONENT } from './dialog-component/dialog-token';
import {EditName} from "../components/dialogs/edit-name/edit-name.component";

@Injectable()
export class PopupService {
  overlayRef: OverlayRef | undefined;
  confirmFunction: ((values: object, stopLoadingButton: () => void) => void) | undefined;
  cancelFunction: (() => void) | undefined;
  component: ComponentType<any>

  constructor(private overlay: Overlay, private injector: Injector) {}

  open<T>(component: ComponentType<T>, confirmationFunction?: (values: object, stopLoadingButton: () => void) => void, cancelFunction?: () => void){
    if (this.overlayRef?.hasAttached()) {
      this.close();
    }

    this.confirmFunction = confirmationFunction;
    this.cancelFunction = cancelFunction;
    this.component = component;

    const overlayConfig = this.getOverlayConfig();
    this.overlayRef = this.overlay.create(overlayConfig);

    const injector = Injector.create({
      parent: this.injector,
      providers: [
        {provide: OVERLAY_REF, useValue: this.overlayRef},
        {provide: OVERLAY_COMPONENT, useValue: component},
      ]
    })

    const dialogRef = new ComponentPortal(DialogComponent, null, injector);
    this.overlayRef.attach(dialogRef);

    this.overlayRef.backdropClick().subscribe(() => this.close());
  }

  openWithArgs(component: ComponentType<any>, args: object) {
    if (this.overlayRef?.hasAttached()) {
      this.close();
    }

    this.component = component;

    const overlayConfig = this.getOverlayConfig();
    this.overlayRef = this.overlay.create(overlayConfig);

    const injector = Injector.create({
      parent: this.injector,
      providers: [
        {provide: OVERLAY_REF, useValue: this.overlayRef},
        {provide: OVERLAY_COMPONENT, useValue: component},
        {provide: 'args', useValue: args},
      ]
    })

    const dialogRef = new ComponentPortal(DialogComponent, null, injector);
    this.overlayRef.attach(dialogRef);

    this.overlayRef.backdropClick().subscribe(() => this.close());
  }

  close() {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
  }

  confirm(stopLoadingButton: () => void) {
    const values = this.component.prototype.getValues();
    this.confirmFunction?.(values, stopLoadingButton);
  }

  cancel() {
    this.cancelFunction?.();
    this.close();
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    return new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'backdrop',
      panelClass: 'custom-overlay-pane-class',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });
  }
}

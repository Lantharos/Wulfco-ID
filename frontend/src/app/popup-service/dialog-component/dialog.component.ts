import {Component, OnInit, ViewContainerRef, ViewChild, Inject} from '@angular/core';
import {OverlayRef, ComponentType} from '@angular/cdk/overlay';
import {OVERLAY_COMPONENT, OVERLAY_REF} from './dialog-token';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent<T> implements OnInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true }) dynamicComponentContainer!: ViewContainerRef;

  constructor(
    @Inject(OVERLAY_REF) public overlayRef: OverlayRef,
    @Inject(OVERLAY_COMPONENT) public component: ComponentType<any>
  ) {}

  ngOnInit() {
    this.loadComponent();
  }

  close(){
    this.overlayRef.detach();
    this.overlayRef.dispose();
  }

  private loadComponent() {
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(this.component);
  }
}

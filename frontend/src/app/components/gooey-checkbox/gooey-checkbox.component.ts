import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-gooey-checkbox',
    templateUrl: './gooey-checkbox.component.html',
    styleUrls: ['./gooey-checkbox.component.css']
})

export class GooeyCheckboxComponent {
    @Input() checked: boolean;
    @Output() checkedChange = new EventEmitter<boolean>();

    public onChange(event: Event): void {
        const checked = (<HTMLInputElement>event.target).checked;

        this.checked = checked;
        this.checkedChange.emit(checked);

        if (checked) {
            this.onEnabled();
        } else {
            this.onDisabled();
        }
    }

    // TODO: Implement `onEnabled` and `onDisabled` functions
    private onEnabled(): void {}
    private onDisabled(): void {}
}
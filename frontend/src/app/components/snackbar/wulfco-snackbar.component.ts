import {Component, Inject, OnDestroy, ViewChild, ElementRef, AfterViewInit} from "@angular/core";
import {MAT_SNACK_BAR_DATA} from "@angular/material/snack-bar";
import { interval, Subscription } from 'rxjs';

@Component({
    selector: 'app-snackbar',
    templateUrl: './wulfco-snackbar.component.html',
    styleUrls: ['./wulfco-snackbar.component.css']
})
export class WulfcoSnackbar implements OnDestroy, AfterViewInit {
    @ViewChild('bar', { static: true }) bar: ElementRef;
    timeLeft: number;
    totalTime: number;
    interval: Subscription;

    // @ts-ignore
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
        this.timeLeft = this.data.totalTime;
        this.totalTime = this.data.totalTime;
    }

    ngAfterViewInit() {
        this.initializeBarAnimation();
    }

    ngOnDestroy() {
        this.interval.unsubscribe();
    }

    private initializeBarAnimation() {
        this.interval = interval(500).subscribe(() => {
            if (this.timeLeft > 0) {
                this.timeLeft -= 500;
                this.bar.nativeElement.style.width = (this.timeLeft / this.totalTime) * 100 + '%';
            } else {
                this.interval.unsubscribe();
            }
        });
    }
}
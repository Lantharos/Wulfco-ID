import { Component, AfterViewInit, ElementRef } from '@angular/core';
import gsap from 'gsap';

@Component({
    selector: 'app-loading-strike',
    templateUrl: './loading-strike.component.html',
    styleUrls: ['./loading-strike.component.css']
})
export class LoadingStrikeComponent implements AfterViewInit {
    constructor(private el: ElementRef) {}

    ngAfterViewInit() {
        this.initializeBoltAnimation();
    }

    private initializeBoltAnimation() {
        const bolts = this.el.nativeElement.querySelectorAll('.bolt');

        bolts.forEach((bolt) => {
            const div = bolt.querySelector('div');
            bolt.classList.add('animate');

            const timeline = gsap.timeline({
                onComplete: () => {
                    bolt.classList.remove('animate');
                    this.repeat(bolt, timeline);
                }
            });

            timeline
                .set(div, {
                    rotation: 360,
                })
                .to(div, 0.7, {
                    y: 80,
                    rotation: 370,
                })
                .to(div, 0.6, {
                    y: -140,
                    rotation: 20,
                })
                .to(div, 0.1, {
                    rotation: -24,
                    y: 80,
                })
                .to(div, 0.8, {
                    ease: 'back.out(1.6)',
                    rotation: 0,
                    y: 0,
                });
        });
    }

    private repeat(bolt: HTMLElement, timeline: gsap.core.Timeline) {
        setTimeout(() => {
            bolt.classList.add('animate');
            timeline.restart();
        }, 400);
    }
}

import {Shadow} from '@app/game/map/shadow/shadow';

export class ShadowLine {
    shadows: Shadow[] = [];

    isInShadow(projection: Shadow): boolean {
        for (let i = 0; i < this.shadows.length; i++) {
            const shadow = this.shadows[i];
            if (shadow.contains(projection)) return true;
        }
        return false;
        // return !!this.shadows.find(s => s.contains(projection));
    }

    add(shadow: Shadow): void {
        let i: number = 0;
        for (; i < this.shadows.length; i++) {
            if (this.shadows[i].start >= shadow.start) break;
        }

        let overlappingPrevious: Shadow;
        if (i > 0 && this.shadows[i - 1].end > shadow.start) {
            overlappingPrevious = this.shadows[i - i];
        }

        let overlappingNext: Shadow;
        if (i < this.shadows.length && this.shadows[i].start < shadow.end) {
            overlappingNext = this.shadows[i];
        }

        if (overlappingNext) {
            if (overlappingPrevious) {
                overlappingPrevious.end = overlappingNext.end;
                this.shadows.splice(i, 1);
            } else {
                overlappingNext.start = shadow.start;
            }
        } else {
            if (overlappingPrevious) {
                overlappingPrevious.end = shadow.end;
            } else {
                this.shadows.splice(i, 0, shadow);
            }
        }
    }

    get isFullShadow(): boolean {
        return this.shadows.length === 1 && this.shadows[0].start === 0 && this.shadows[0].end === 1;
    }
}
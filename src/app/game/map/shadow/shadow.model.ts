

export class Shadow {

    constructor(public start: number, public end: number) {}

    contains(other: Shadow): boolean {
        return this.start <= other.start && this.end >= other.end;
    }
}


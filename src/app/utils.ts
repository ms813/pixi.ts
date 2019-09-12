import Point = PIXI.Point;

export class Utils {
    public static randomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    public static randomEnum<T>(anEnum: T): T[keyof T] {
        const enumValues = Object.keys(anEnum)
        .map(n => Number.parseInt(n))
        .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][];
        const randomIndex = Math.floor(Math.random() * enumValues.length);
        return enumValues[randomIndex];
    }

    public static transformOctant(row: number, col: number, octant: number): Point {
        switch (octant) {
            case 0:
                return new Point(col, -row);
            case 1:
                return new Point(row, -col);
            case 2:
                return new Point(row, col);
            case 3:
                return new Point(col, row);
            case 4:
                return new Point(-col, row);
            case 5:
                return new Point(-row, col);
            case 6:
                return new Point(-row, -col);
            case 7:
                return new Point(-col, -row);
        }
    }

    public static isWithinSquare(x1: number, y1: number, x2: number, y2: number, r: number): boolean {
        if (r <= 0) {
            console.debug('Utils::isWithinSquare - radius is 0, returning false');
            return false;
        }

        const isWithinRange = x1 <= x2 + r
            && x1 >= x2 - r
            && y1 <= y2 + r
            && y1 >= y2 - r;
        console.debug(`Utils::isWithinSquare - p1 = (${x1}, ${y1}), p2 = (${x2}, ${y2}), r = ${r}, isWithinRange = ${isWithinRange}`);
        return isWithinRange;
    }
}

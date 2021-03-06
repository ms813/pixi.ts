import {Point} from 'pixi.js';

export class Utils {
    public static randomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    public static randomBoolean(): boolean {
        return Math.random() < 0.5;
    }

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

    public static isWithinSquare(x: number, y: number, centerX: number, centerY: number, r: number): boolean {
        if (r < 0) {
            console.debug('Utils::isWithinSquare - radius is negative, returning false');
            return false;
        }

        const isWithinRange = x <= centerX + r
            && x >= centerX - r
            && y <= centerY + r
            && y >= centerY - r;
        console.debug(`Utils::isWithinSquare - p1 = (${x}, ${y}), p2 = (${centerX}, ${centerY}), r = ${r}, isWithinRange = ${isWithinRange}`);
        return isWithinRange;
    }

    public static rollProbability(probability: number): boolean {
        return Math.random() < probability;
    }
}

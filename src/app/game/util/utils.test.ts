import {Utils} from '@app/game/util/utils';
import {Point} from 'pixi.js';

describe('Utils', () => {
    describe('isWithinSquare', () => {
        test('is within square at origin', () =>
            expect(Utils.isWithinSquare(0, 0, 0, 0, 1)).toBe(true)
        );

        test('is within square, negative point', () =>
            expect(Utils.isWithinSquare(-0.5, 0, 1, 1, 2)).toBe(true)
        );

        test('is within square of zero radius', () =>
            expect(Utils.isWithinSquare(0, 0, 0, 0, 0)).toBe(true)
        );

        test('is not within square of zero radius', () => expect(Utils.isWithinSquare(-0.5, 0, 0, 0, 0)).toBe(false));

        test('is not within square at origin', () =>
            expect(Utils.isWithinSquare(0, 0, 2, 0, 1)).toBe(false)
        );

        test('is not within square', () =>
            expect(Utils.isWithinSquare(10, 10, 2, -6, 2)).toBe(false)
        );

        test('negative radius should always return false', () =>
            expect(Utils.isWithinSquare(0, 0, 0, 0, -2)).toBe(false)
        );
    });

    describe('transformOctant', () => {
        console.log(Point);
        expect(Utils.transformOctant(1, 2, 0)).toBe(new Point(2, -1));
        expect(Utils.transformOctant(1, 2, 1)).toBe(new Point(1, -2));
        expect(Utils.transformOctant(1, 2, 2)).toBe(new Point(1, 2));
        expect(Utils.transformOctant(1, 2, 3)).toBe(new Point(2, 1));
        expect(Utils.transformOctant(1, 2, 4)).toBe(new Point(-2, 1));
        expect(Utils.transformOctant(1, 2, 5)).toBe(new Point(-1, 2));
        expect(Utils.transformOctant(1, 2, 6)).toBe(new Point(-1, -2));
        expect(Utils.transformOctant(1, 2, 7)).toBe(new Point(-2, -1));
    });
});
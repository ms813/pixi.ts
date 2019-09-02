import {LevelMap} from '@app/game/map/level-map';

describe('LevelMap', () => {

    let levelMap: LevelMap = new LevelMap(7, 8);

    test('indexToCoords in bounds', () => {
        expect(levelMap.indexToCoords(0)).toBe({x: 0, y: 0});
        expect(levelMap.indexToCoords(1)).toBe({x: 1, y: 0});
        expect(levelMap.indexToCoords(6)).toBe({x: 6, y: 0});
        expect(levelMap.indexToCoords(7)).toBe({x: 0, y: 1});
        expect(levelMap.indexToCoords(8)).toBe({x: 1, y: 1});
        expect(levelMap.indexToCoords(13)).toBe({x: 6, y: 1});
        expect(levelMap.indexToCoords(55)).toBe({x: 7, y: 8});
    });
});
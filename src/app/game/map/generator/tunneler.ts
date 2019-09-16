import {TunnelerParams} from '@app/game/map/generator/tunneler.params';
import {LevelMap} from '@app/game/map';
import {TileType} from '@app/game/map/tile';
import {Utils} from '@app/game/util/utils';
import {Direction} from '@app/game/util/direction.enum';

export class Tunneler {

    public alive: boolean = true;
    private age: number = 0;
    private x: number;
    private y: number;
    private direction: Direction;

    constructor(private readonly params: TunnelerParams) {
        Object.freeze(params);
        this.x = params.x;
        this.y = params.y;
        this.direction = params.direction;
    }

    public step(map: LevelMap): LevelMap {
        if (this.age === 0) {
            return this.excavateStart(map);
        } else {
            const {x: dx, y: dy} = Utils.direction[this.direction];
            this.x;
        }

        this.age++;
    }

    private excavateStart(map: LevelMap): LevelMap {
        console.log('Tunneler::excavateStart', this.params);
        const {width: {initial}} = this.params;

        for (let i = this.x - initial + 1; i < this.x + initial; i++) {
            for (let j = this.y - initial + 1; j < this.y + initial; j++) {
                map.tiles[map.coordsToIndex(i, j)].type = TileType.FLOOR;
            }
        }

        return map;
    }
}

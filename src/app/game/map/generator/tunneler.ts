import {TunnelerParams} from '@app/game/map/generator/tunneler.params';
import {LevelMap} from '@app/game/map';
import {TileType} from '@app/game/map/tile';
import {DirectionHelper, Utils} from '@app/game/util/';
import {Point} from 'pixi.js';

export class Tunneler {

    public alive: boolean = true;
    private age: number = 0;
    private x: number;
    private y: number;
    private direction: Point;
    private width: number;

    constructor(private readonly params: TunnelerParams) {
        Object.freeze(params);
        this.x = params.x;
        this.y = params.y;
        this.direction = params.direction;
        this.width = params.width.initial;
    }

    public step(map: LevelMap): LevelMap {
        console.debug(`Tunneler::step - begin step ${this.age}`);
        if (this.age === 0) {
            this.excavateSquare(map, 5);
        } else {
            console.log(this.direction);
            const {x: dx, y: dy} = this.direction;
            this.x += dx;
            this.y += dy;

            if (!map.isInBounds(this.x, this.y)) {
                console.log(`Tunneler::step - out of bounds at (${this.x}, ${this.y}), killing tunneler`);
                this.alive = false;
                return map;
            }

            if (Utils.rollProbability(this.params.deathProbability)) {
                console.log(`Tunneler::step - rolled death probability, killing tunneler`);
                this.alive = false;
                return map;
            }

            if (Utils.rollProbability(this.params.turnProbability)) {
                this.excavateJunction(map);
            }

            this.digTunnel(map);
        }

        this.age++;
        return map;
    }

    private excavateSquare(map: LevelMap, radius: number) {
        const oddEven = radius % 2 === 0 ? 0 : 1;
        for (let i = this.x - radius + oddEven; i < this.x + radius; i++) {
            for (let j = this.y - radius + 1; j < this.y + radius; j++) {
                map.tiles[map.coordsToIndex(i, j)].type = TileType.FLOOR;
            }
        }
    }

    private excavateJunction(map: LevelMap): boolean {
        console.log(`Tunneler::excavateJunction`);
        let oldDirection: Point = this.direction;
        while (oldDirection === this.direction) {
            this.direction = DirectionHelper.random('cardinal');
        }
        console.log(this.direction);
        this.excavateSquare(map, 3);
        return true;
    }

    private digTunnel(map: LevelMap): boolean {
        console.log('Tunneler::digTunnel');
        if (this.width % 2 === 0) {
            // width is even
        } else {
            // width is odd
            const h = (this.width - 1) / 2;
            for (let i = -h; i <= h; i++) {
                if (this.direction === DirectionHelper.NORTH || this.direction === DirectionHelper.SOUTH) {
                    map.tiles[map.coordsToIndex(this.x + i, this.y)].type = TileType.FLOOR;
                } else if (this.direction === DirectionHelper.EAST || this.direction === DirectionHelper.WEST) {
                    map.tiles[map.coordsToIndex(this.x, this.y + i)].type = TileType.FLOOR;
                }
            }
        }
        return true;
    }
}

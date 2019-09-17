import {TunnelerParams} from '@app/game/map/generator/tunneler.params';
import {LevelMap} from '@app/game/map';
import {TileType} from '@app/game/map/tile';
import {Utils} from '@app/game/util/';
import {Point} from 'pixi.js';

export class Tunneler {

    public alive: boolean = true;
    public age: number = 0;
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
            this.excavateSquare(map, this.width + Utils.randomInt(this.params.junction.minPadding, this.params.junction.maxPadding));
        } else {
            let {x: dx, y: dy} = this.direction;

            while (!map.isInBounds(this.x + dx, this.y + dy)) {
                console.log(`Tunneler::step - out of bounds at (${this.x}, ${this.y}), changing direction`);
                this.direction = this.changeDirection(this.direction);
                dx = this.direction.x;
                dy = this.direction.y;
            }

            this.x += dx;
            this.y += dy;

            if (Utils.rollProbability(this.params.deathProbability)) {
                console.log(`Tunneler::step - died of old age after ${this.age} steps`);
                this.alive = false;
                return map;
            }

            if (Utils.rollProbability(this.params.turnProbability)) {
                this.excavateJunction(map);
            }

            if (Utils.rollProbability(this.params.width.changeProbability)) {
                let thicker;
                if (this.width >= this.params.width.max) {
                    thicker = false;
                } else if (this.width <= this.params.width.min) {
                    thicker = true;
                } else {
                    thicker = Utils.randomBoolean();
                }

                this.width += thicker ? 2 : -2;
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
                if (map.isInBounds(i, j)) {
                    map.tiles[map.coordsToIndex(i, j)].type = TileType.FLOOR;
                }
            }
        }
    }

    private changeDirection(dir: Point): Point {
        return new Point(dir.y * (Utils.randomBoolean() ? 1 : -1), dir.x * (Utils.randomBoolean() ? 1 : -1));
    }

    private excavateJunction(map: LevelMap): boolean {
        console.debug(`Tunneler::excavateJunction at (${this.x}, ${this.y})`);
        this.direction = this.changeDirection(this.direction);
        if (Utils.rollProbability(this.params.junction.probability)) {
            const {junction: j} = this.params;
            this.excavateSquare(map, this.width + Utils.randomInt(j.minPadding, j.maxPadding));
        }

        return true;
    }

    private digTunnel(map: LevelMap): boolean {
        // width is even
        let h: number = this.width / 2;
        let o: number = 1;

        if (this.width % 2 !== 0) {
            // width is odd
            h = (this.width - 1) / 2;
            o = 0;
        }

        for (let i = -h + o; i <= h; i++) {
            let {x, y} = this;
            if (this.direction.x === 0) {
                x += i;
            } else if (this.direction.y === 0) {
                y += i;
            }

            if (map.isInBounds(x, y)) {
                console.debug(`Tunneler::digTunnel - (${x}, ${y})`);
                map.tiles[map.coordsToIndex(x, y)].type = TileType.FLOOR;
            }
        }
        return true;
    }
}

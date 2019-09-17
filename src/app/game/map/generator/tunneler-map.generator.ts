import {LevelMapGenerator} from '@app/game/map/generator/level-map.generator';
import {TileType} from '@app/game/map/tile';
import {TunnelerParams} from '@app/game/map/generator/tunneler.params';
import {LevelMap} from '@app/game/map';
import {Tunneler} from '@app/game/map/generator/tunneler';
import {Point} from 'pixi.js';

export class TunnelerMapGenerator extends LevelMapGenerator {

    private tunnelers: Tunneler[] = [];
    public complete: boolean = false;

    constructor(width: number, height: number, tileset: string = 'map_tiles') {
        super(width, height, tileset);

        this.map = this.init(this.map, TileType.WALL);
    }

    withTunneler(tunnelerParams: TunnelerParams, x?: number, y?: number, direction?: Point): TunnelerMapGenerator {
        const params: TunnelerParams = Object.assign({}, tunnelerParams);
        params.x = x;
        params.y = y;
        params.direction = direction;
        this.tunnelers.push(new Tunneler(params));
        return this;
    }

    discovered(discovered: boolean): TunnelerMapGenerator {
        super.discovered(discovered);
        return this;
    }

    fog(fog: boolean): TunnelerMapGenerator {
        super.fog(fog);
        return this;
    }

    grid(lineColor: number): TunnelerMapGenerator {
        super.grid(lineColor);
        return this;
    }

    public step(): LevelMap {

        this.tunnelers.forEach(t => {
            if (t.alive) {
                t.step(this.map);
            }
        });

        if (this.tunnelers.length === this.tunnelers.filter(t => !t.alive).length) {
            this.complete = true;
            const maxAge = Math.max(...this.tunnelers.map(t => t.age));
            console.log(`TunnelerMapGenerator::step - Mapgen finished after ${maxAge} steps`);
        }
        return this.map;
    }

    public build(): LevelMap {
        while (this.tunnelers.find(t => t.alive)) {
            this.step();
        }
        this.complete = true;
        return this.map;
    }
}
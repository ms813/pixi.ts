import {LevelMapGenerator} from '@app/game/map/generator/level-map.generator';
import {TileType} from '@app/game/map/tile';
import {TunnelerParams} from '@app/game/map/generator/tunneler.params';
import {LevelMap} from '@app/game/map';
import {Tunneler} from '@app/game/map/generator/tunneler';

export class TunnelerMapGenerator extends LevelMapGenerator {

    private tunnelerParams: TunnelerParams[] = [];

    constructor(width: number, height: number, tileset: string = 'map_tiles') {
        super(width, height, tileset);

        this.map = this.init(this.map, TileType.WALL);
    }

    withTunneler(tunnelerParams: TunnelerParams): TunnelerMapGenerator {
        this.tunnelerParams.push(tunnelerParams);
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

    public build(): LevelMap {
        const tunnelers: Tunneler[] = this.tunnelerParams.map((params: TunnelerParams) => new Tunneler(params));
        tunnelers.forEach(t => {
            if (t.alive) {
                t.step(this.map);
            }
        });

        return this.map;
    }
}
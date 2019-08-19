import {LevelMap} from './level-map.model';
import {Tile} from '@app/game/map/tile.model';

export class LevelMapGenerator {

    private map: LevelMap;

    constructor() {
        this.map = new LevelMap();
    }

    public height(height: number): LevelMapGenerator {
        this.map.height = height;
        return this;
    }

    public width(width: number): LevelMapGenerator {
        this.map.width = width;
        return this;
    }

    public build(): LevelMap {
        const w = this.map.width;
        const h = this.map.height;

        const tiles: Tile[] = [];
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                tiles[y * w + x] = new Tile(x, y);
            }
        }
        console.log(tiles);
        this.map.tiles = tiles;

        return this.map;
    }
}
import {LevelMap} from '../level-map';
import {TileType} from '../tile/tile-type';
import {LevelMapGenerator} from '@app/game/map/generator/level-map.generator';

export class SimpleMapGenerator extends LevelMapGenerator {

    constructor(width: number, height: number, tileset = 'map_tiles') {
        super(width, height, tileset);
        this.map = this.init(this.map, TileType.FLOOR);
    }

    public fog(fog: boolean): SimpleMapGenerator {
        super.fog(fog);
        return this;
    }

    public discovered(discovered: boolean): SimpleMapGenerator {
        super.discovered(discovered);
        return this;
    }

    public grid(lineColor: number): SimpleMapGenerator {
        super.grid(lineColor);
        return this;
    }

    randomWalls(density: number): SimpleMapGenerator {
        const {width, height, tiles} = this.map;
        if (density < 0 || density > 1) {
            console.error(`LevelMapGenerator::randomWalls density out of bounds, expected a value between 0 and 1 inclusive, instead got ${density}`);
            density = 0;
        }
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                if (Math.random() < density) {
                    const t = tiles[this.map.coordsToIndex(x, y)];
                    t.type = TileType.WALL;
                    t.discoveredTexture = this.resources.textures['wall.png'];
                }
            }
        }
        return this;
    }

    public build(): LevelMap {
        return this.map;
    }
}
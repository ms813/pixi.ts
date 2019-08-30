import {LevelMap} from './level-map';
import {Tile} from '@app/game/map/tile';
import {TILE_WIDTH} from '@app/game/game';
import Resource = PIXI.loaders.Resource;
import loader = PIXI.loader;
import Container = PIXI.Container;
import Graphics = PIXI.Graphics;

export class LevelMapGenerator {

    private readonly map: LevelMap;
    private readonly resources: Resource;

    constructor(width: number, height: number) {
        this.resources = loader.resources['map_tiles'];
        this.map = this.init(new LevelMap(width, height));
    }

    public grid(lineColor: number): LevelMapGenerator {
        const {width, height} = this.map;
        const addVerticalLine = (x: number): Graphics => {
            const g = new Graphics();
            g.position.set(x, 0);
            return g.lineStyle(1, lineColor)
            .moveTo(0, 0)
            .lineTo(0, this.map.height * TILE_WIDTH);
        };
        const addHorizontalLine = (y: number): Graphics => {
            const g = new Graphics();
            g.position.set(0, y);
            return g.lineStyle(1, lineColor)
            .moveTo(0, 0)
            .lineTo(this.map.width * TILE_WIDTH, 0);
        };

        const gridContainer = new Container();
        for (let x = 1; x < width; x++) {
            gridContainer.addChild(addVerticalLine(x * TILE_WIDTH));
        }

        for (let y = 1; y < height; y++) {
            gridContainer.addChild(addHorizontalLine(y * TILE_WIDTH));
        }

        this.map.grid = gridContainer;
        // this.grid = new Sprite(autoDetectRenderer().generateTexture(gridContainer));
        this.map.isGridVisible = true;

        return this;
    }


    private init(map: LevelMap): LevelMap {
        const {width, height} = map;

        const {textures} = this.resources;

        const tiles: Tile[] = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let texture = textures['test_tiles_3.png'];
                let passable = true;
                // map bounds are impassible
                if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
                    texture = textures['test_tiles_0.png'];
                    passable = false;
                }

                const tile = new Tile(x, y, texture);
                tile.passable = passable;
                tiles[y * width + x] = tile;
            }
        }
        console.debug(tiles);
        map.tiles = tiles;
        return map;
    }

    randomWalls(density: number): LevelMapGenerator {
        const {width, height, tiles} = this.map;
        if (density < 0 || density > 1) {
            console.error(`LevelMapGenerator::randomWalls density out of bounds, expected a value between 0 and 1 inclusive, instead got ${density}`);
            density = 0;
        }
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                if (Math.random() < density) {
                    const t = tiles[this.map.coordsToIndex(x, y)];
                    t.passable = false;
                    t.texture = this.resources.textures['test_tiles_0.png'];
                }
            }
        }

        return this;
    }

    public build(): LevelMap {
        return this.map;
    }
}
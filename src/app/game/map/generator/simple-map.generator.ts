import {LevelMap} from '../level-map';
import {Tile} from '../tile/tile';
import {TILE_SIZE} from '../../game';
import {TileType} from '../tile/tile-type';
import {Container, Graphics, loader, loaders, Texture} from 'pixi.js';
import {LevelMapGenerator} from '@app/game/map/generator/level-map.generator';
import Resource = loaders.Resource;

export class SimpleMapGenerator implements LevelMapGenerator {

    private readonly map: LevelMap;
    private readonly resources: Resource;

    constructor(width: number, height: number) {
        this.resources = loader.resources['map_tiles'];

        this.map = this.init(new LevelMap(width, height));
    }

    public grid(lineColor: number): SimpleMapGenerator {
        const {width, height} = this.map;
        const addVerticalLine = (x: number): Graphics => {
            const g = new Graphics();
            g.position.set(x, 0);
            return g.lineStyle(1, lineColor)
            .moveTo(0, 0)
            .lineTo(0, this.map.height * TILE_SIZE);
        };
        const addHorizontalLine = (y: number): Graphics => {
            const g = new Graphics();
            g.position.set(0, y);
            return g.lineStyle(1, lineColor)
            .moveTo(0, 0)
            .lineTo(this.map.width * TILE_SIZE, 0);
        };

        const gridContainer = new Container();
        for (let x = 1; x < width; x++) {
            gridContainer.addChild(addVerticalLine(x * TILE_SIZE));
        }

        for (let y = 1; y < height; y++) {
            gridContainer.addChild(addHorizontalLine(y * TILE_SIZE));
        }

        this.map.grid = gridContainer;
        // this.grid = new Sprite(autoDetectRenderer().generateTexture(gridContainer));
        this.map.isGridVisible = true;

        return this;
    }

    public fog(fog: boolean): SimpleMapGenerator {
        this.map.fog = fog;
        return this;
    }

    public discovered(discovered: boolean): SimpleMapGenerator {
        this.map.tiles.forEach(t => t.isDiscovered = discovered);
        return this;
    }

    private init(map: LevelMap): LevelMap {
        const {width, height} = map;

        const {textures} = this.resources;

        const tiles: Tile[] = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let texture: Texture = textures['floor.png'];
                let tileType: TileType = TileType.FLOOR;
                // map bounds are impassible
                if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
                    texture = textures['indestructable_wall.png'];
                    tileType = TileType.INDESTRUCTABLE_WALL;
                }

                tiles[y * width + x] = new Tile(x, y, texture, tileType);
            }
        }
        console.debug(tiles);
        map.tiles = tiles;
        return map;
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
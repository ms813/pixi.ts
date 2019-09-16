import {LevelMap} from '@app/game/map';
import {Container, Graphics, loader} from 'pixi.js';
import {TILE_SIZE} from '@app/game/game';
import {Tile, TileType} from '@app/game/map/tile';
import Resource = PIXI.loaders.Resource;

export abstract class LevelMapGenerator {

    protected map: LevelMap;
    protected resources: Resource;

    protected constructor(width: number, height: number, tileset: string = 'map_tiles') {
        this.resources = loader.resources[tileset];
        this.map = new LevelMap(width, height);
    }

    protected init(map: LevelMap, defaultTileType: TileType): LevelMap {
        const {width, height} = map;

        const tiles: Tile[] = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let tileType: TileType = defaultTileType;
                // map bounds are impassible
                if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
                    tileType = TileType.INDESTRUCTABLE_WALL;
                }
                tiles[this.map.coordsToIndex(x, y)] = new Tile(x, y, tileType);
            }
        }
        console.debug('LevelMapGenerator::init - tiles: ', tiles);
        map.tiles = tiles;
        return map;
    }

    public build(): LevelMap {
        return this.map;
    };

    protected grid(lineColor: number): LevelMapGenerator {
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

    protected fog(fog: boolean): LevelMapGenerator {
        this.map.fog = fog;
        return this;
    };

    protected discovered(discovered: boolean): LevelMapGenerator {
        this.map.tiles.forEach(t => t.isDiscovered = discovered);
        return this;
    }
}
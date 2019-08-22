import {LevelMap} from './level-map';
import {Tile} from '@app/game/map/tile';
import Resource = PIXI.loaders.Resource;
import loader = PIXI.loader;
import Container = PIXI.Container;
import Graphics = PIXI.Graphics;

export class LevelMapGenerator {

    private readonly map: LevelMap;
    private readonly resources: Resource;

    constructor() {
        this.resources = loader.resources['map_tiles'];
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

    public grid(lineColor: number): LevelMapGenerator {
        const tileWidth = Object.values(this.resources.textures)[0].width;

        const {width, height} = this.map;
        const addVerticalLine = (x: number): Graphics => {
            const g = new Graphics();
            g.position.set(x, 0);
            return g.lineStyle(1, lineColor)
            .moveTo(0, 0)
            .lineTo(0, this.map.height * 32);
        };
        const addHorizontalLine = (y: number): Graphics => {
            const g = new Graphics();
            g.position.set(0, y);
            return g.lineStyle(1, lineColor)
            .moveTo(0, 0)
            .lineTo(this.map.width * tileWidth, 0);
        };

        const gridContainer = new Container();
        for (let x = 1; x < width; x++) {
            gridContainer.addChild(addVerticalLine(x * tileWidth));
        }

        for (let y = 1; y < height; y++) {
            gridContainer.addChild(addHorizontalLine(y * tileWidth));
        }

        this.map.grid = gridContainer;
        // this.grid = new Sprite(autoDetectRenderer().generateTexture(gridContainer));
        this.map.isGridVisible = true;

        return this;
    }


    public build(): LevelMap {
        const w = this.map.width;
        const h = this.map.height;

        const {textures} = this.resources;

        const tiles: Tile[] = [];
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const tile = new Tile(x, y, textures['test_tiles_3.png']);
                tiles[y * w + x] = tile;
            }
        }
        console.log(tiles);
        this.map.tiles = tiles;
        this.map.isGridVisible = false;
        this.map.isGridVisible = true;
        return this.map;
    }
}
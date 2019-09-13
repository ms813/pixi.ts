import {Sprite, Texture, loader} from 'pixi.js';
import {TileType} from '@app/game/map/tile/tile-type';
import {TILE_SIZE} from '@app/game/game';
import {Movable} from '@app/game/actor';

export class Tile extends Sprite {

    public passable: boolean = false;
    private _type: TileType;
    private _isVisible: boolean;
    private _isDiscovered: boolean;
    private _discoveredTexture: Texture;
    private previousTint: number;

    private static undiscoveredTexture: Texture;

    constructor(
        public readonly mapX: number,
        public readonly mapY: number,
        texture: Texture,
        type: TileType = TileType.FLOOR
    ) {
        super();
        if (!Tile.undiscoveredTexture) {
            Tile.undiscoveredTexture = loader.resources['map_tiles'].textures['undiscovered.png'];
        }

        this.discoveredTexture = texture;


        this.x = mapX * TILE_SIZE;
        this.y = mapY * TILE_SIZE;
        this.type = type;

        this.interactive = true;
        this.on('mouseover', () => this.tint = 0x00ffff);
        this.on('mousedown', () => console.log(`Clicked on tile at (${this.mapX}, ${this.mapY}): ${TileType[this.type]}`));
        this.on('mouseout', () => this.tint = this.previousTint);

        this.isDiscovered = false;
        this.isVisible = false;
    }

    public set type(type: TileType) {
        this._type = type;
        this.passable = type === TileType.FLOOR;
    }

    public get type(): TileType {
        return this._type;
    }

    get isVisible(): boolean {
        return this._isVisible;
    }

    set isVisible(isVisible: boolean) {
        this._isVisible = isVisible;

        if (this._isVisible) {
            this.isDiscovered = true;
            this.previousTint = 0xffffff;
        } else {
            this.previousTint = 0xcccccc;
        }

        this.tint = this.previousTint;
    }

    get isDiscovered(): boolean {
        return this._isDiscovered;
    }

    set isDiscovered(isDiscovered: boolean) {
        this._isDiscovered = isDiscovered;

        if (isDiscovered) {
            this.texture = this.discoveredTexture;
        } else {
            this.texture = Tile.undiscoveredTexture;
        }
    }

    get discoveredTexture(): Texture {
        return this._discoveredTexture;
    }

    set discoveredTexture(value: Texture) {
        this._discoveredTexture = value;
    }

    public contains({x, y}: Movable): boolean {
        return this.mapX === x && this.mapY === y;
    }
}


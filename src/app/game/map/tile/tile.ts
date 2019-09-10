import Sprite = PIXI.Sprite;
import Texture = PIXI.Texture;
import loader = PIXI.loader;
import {TileType} from '@app/game/map/tile/tile-type';
import {TILE_SIZE} from '@app/game/game';

export class Tile extends Sprite {

    public passable: boolean = false;
    private _type: TileType;
    private _isVisible: boolean;
    private _isDiscovered: boolean;
    private _discoveredTexture: Texture;

    private static undiscoveredTexture: Texture;

    constructor(
        x: number,
        y: number,
        texture: Texture,
        type: TileType = TileType.FLOOR
    ) {
        super();
        if (!Tile.undiscoveredTexture) {
            Tile.undiscoveredTexture = loader.resources['map_tiles'].textures['undiscovered.png'];
        }

        this.discoveredTexture = texture;

        this.x = x * TILE_SIZE;
        this.y = y * TILE_SIZE;
        this.type = type;

        this.interactive = true;
        this.on('mouseover', () => this.tint = 0x00ffff);
        this.on('mousedown', () => console.log(TileType[this.type]));
        this.on('mouseout', () => this.tint = 0xffffff);

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
            this.tint = 0xffffff;
        } else {
            this.tint = 0xcccccc;
        }
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
}


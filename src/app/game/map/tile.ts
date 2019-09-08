import Sprite = PIXI.Sprite;
import Texture = PIXI.Texture;
import {TileType} from '@app/game/map/tile-type';
import {TILE_SIZE} from '@app/game/game';

export class Tile extends Sprite {

    public passable: boolean = false;
    private _type: TileType;

    constructor(
        x: number,
        y: number,
        texture: Texture,
        type: TileType = TileType.FLOOR
    ) {
        super(texture);
        this.x = x * TILE_SIZE;
        this.y = y * TILE_SIZE;
        this.type = type;

        this.interactive = true;
        this.on('mouseover', () => this.tint = 0x00ffff);
        this.on('mouseout', () => this.tint = 0xffffff);
    }

    public set type(type: TileType) {
        this._type = type;
        this.passable = type === TileType.FLOOR;
    }

    public get type(): TileType {
        return this._type;
    }
}


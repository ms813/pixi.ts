import Sprite = PIXI.Sprite;
import Texture = PIXI.Texture;

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
        this.x = x * texture.width;
        this.y = y * texture.height;
        this.type = type;
    }

    public set type(type: TileType) {
        this._type = type;
        this.passable = type === TileType.FLOOR;
    }

    public get type(): TileType {
        return this._type;
    }
}

export enum TileType {
    FLOOR, WALL, INDESTRUCTABLE_WALL
}
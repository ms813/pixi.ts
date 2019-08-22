import Sprite = PIXI.Sprite;
import Texture = PIXI.Texture;

export class Tile extends Sprite {

    public passable: boolean = false;

    constructor(
        x: number,
        y: number,
        public texture: Texture
    ) {
        super(texture);
        this.x = x * texture.width;
        this.y = y * texture.height;
    }
}
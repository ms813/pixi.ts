import {Direction} from '@app/game/direction.enum';
import {TILE_WIDTH} from '@app/game/game';
import Sprite = PIXI.Sprite;

export abstract class Movable {

    private _sprite: Sprite;
    protected _moveSpeed: number = 100;
    private _hp: number = 100;

    protected constructor(public readonly id: string) {}

    public static readonly moveFnMap: { [key: string]: (m: Movable) => void } = {
        [Direction.N]: (m: Movable) => --m.y,
        [Direction.NE]: (m: Movable) => {
            ++m.x;
            --m.y;
        },
        [Direction.E]: (m: Movable) => ++m.x,
        [Direction.SE]: (m: Movable) => {
            ++m.x;
            ++m.y;
        },
        [Direction.S]: (m: Movable) => ++m.y,
        [Direction.SW]: (m: Movable) => {
            --m.x;
            ++m.y;
        },
        [Direction.W]: (m: Movable) => --m.x,
        [Direction.NW]: (m: Movable) => {
            --m.x;
            --m.y;
        }
    };

    abstract doTurn(delay?: number): Movable;

    move(direction: Direction, isLegalMove: boolean) {
        if (isLegalMove) {
            Movable.moveFnMap[direction](this);
        }

        return {x: this.x, y: this.y};
    }

    get sprite(): Sprite {
        return this._sprite;
    }

    set sprite(value: Sprite) {
        this._sprite = value;
    }

    get x(): number {
        return Math.floor(this.sprite.x / TILE_WIDTH);
    }

    set x(x: number) {
        this.sprite.x = Math.floor(TILE_WIDTH * x);
    }

    get y(): number {
        return Math.floor(this.sprite.y / TILE_WIDTH);
    }

    set y(y: number) {
        this.sprite.y = Math.floor(TILE_WIDTH * y);
    }

    get hp(): number {
        return this._hp;
    }

    set hp(value: number) {
        console.debug(`${this.id} hit for ${value} damage. Hp before: ${this._hp}, hp after:${value}`);
        this._hp = value;
    }

    get moveSpeed(): number {
        return this._moveSpeed;
    }

    set moveSpeed(moveSpeed: number) {
        this._moveSpeed = moveSpeed;
    }
}
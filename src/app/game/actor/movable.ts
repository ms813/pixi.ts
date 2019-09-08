import {Direction} from '@app/game/direction.enum';
import {TILE_SIZE} from '@app/game/game';
import Sprite = PIXI.Sprite;

export abstract class Movable {

    private _sprite: Sprite;
    protected _moveSpeed: number = 100;
    private _hp: number = 100;

    public onMove: ((prevPos: { x: number, y: number }, nextPos: { x: number, y: number }) => void)[];

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
        const prevPos = {x: this.x, y: this.y};
        if (isLegalMove) {
            Movable.moveFnMap[direction](this);
        }
        const movePos = {x: this.x, y: this.y};
        this.onMove.forEach(fn => fn(prevPos, movePos));
        return movePos;
    }

    get sprite(): Sprite {
        return this._sprite;
    }

    set sprite(value: Sprite) {
        this._sprite = value;
    }

    get x(): number {
        return Math.floor(this.sprite.x / TILE_SIZE);
    }

    set x(x: number) {
        this.sprite.x = Math.floor(TILE_SIZE * x);
    }

    get y(): number {
        return Math.floor(this.sprite.y / TILE_SIZE);
    }

    set y(y: number) {
        this.sprite.y = Math.floor(TILE_SIZE * y);
    }

    get hp(): number {
        return this._hp;
    }

    set hp(value: number) {
        const diff = this._hp - value;
        console.debug(`${this.id} ${diff > 0 ? 'damaged' : 'healed'} for ${Math.abs(diff)}. Hp before: ${this._hp}, hp after:${value}`);
        this._hp = value;
    }

    get moveSpeed(): number {
        return this._moveSpeed;
    }

    set moveSpeed(moveSpeed: number) {
        this._moveSpeed = moveSpeed;
    }
}
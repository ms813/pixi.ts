import {Direction} from '@app/game/direction.enum';
import {TILE_SIZE} from '@app/game/game';
import {HealthBar} from '@app/game/actor/health-bar';
import Sprite = PIXI.Sprite;

export abstract class Movable {

    private _sprite: Sprite;
    protected _moveSpeed: number = 100;
    private _maxHp: number;
    private _currentHp: number;
    private healthBar: HealthBar;

    public onDeath: Function[] = [];

    public onMove: ((prevPos: { x: number, y: number }, nextPos: { x: number, y: number }) => void)[];

    protected constructor(public readonly id: string) {
        this.maxHp = 10;
    }

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

        this.sprite.addChild(this.healthBar);
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

    get maxHp(): number {
        return this._maxHp;
    }

    set maxHp(newMaxHp: number) {
        if (!this.healthBar) {
            this.healthBar = new HealthBar();
        }

        this.healthBar.maxHp = newMaxHp;

        const oldMaxHp = this.maxHp;
        if (newMaxHp > oldMaxHp) {
            this.currentHp += newMaxHp - oldMaxHp;
        } else {
            this.currentHp = this._currentHp || newMaxHp;
        }

        this._maxHp = newMaxHp;
    }

    get currentHp(): number {
        return this._currentHp;
    }

    set currentHp(newHp: number) {

        // clamp current hp so it can't go above max hp
        if (newHp > this.maxHp) {
            newHp = this.maxHp;
        }

        const diff = this._currentHp - newHp;
        console.debug(`${this.id} ${diff > 0 ? 'damaged' : 'healed'} for ${Math.abs(diff)}. Hp before: ${this._currentHp}, hp after:${newHp}`);

        this._currentHp = newHp;
        this.healthBar.currentHp = this._currentHp;
        if (this._currentHp <= 0) {
            this.onDeath.forEach(fn => fn(this));
        }
    }

    get moveSpeed(): number {
        return this._moveSpeed;
    }

    set moveSpeed(moveSpeed: number) {
        this._moveSpeed = moveSpeed;
    }
}
import {TILE_SIZE} from '@app/game/game';
import {Container, Graphics} from 'pixi.js';

export class HealthBar extends Container {

    private backgroundBar: Graphics;
    private healthBar: Graphics;
    private _maxHp: number;
    private _currentHp: number;

    constructor() {
        super();
        this.y = 28;
    }

    set maxHp(maxHp: number) {
        this._maxHp = maxHp;

        this.removeChild(this.backgroundBar);
        this.backgroundBar = new Graphics();
        this.backgroundBar.beginFill(0xff0000);
        this.backgroundBar.lineStyle(0);
        this.backgroundBar.drawRect(0, 0, TILE_SIZE, 4);
        this.addChild(this.backgroundBar);
    }

    get maxHp(): number {
        return this._maxHp;
    }

    get currentHp(): number {
        return this._currentHp;
    }

    set currentHp(currentHp: number) {
        this._currentHp = currentHp;

        this.removeChild(this.healthBar);
        this.healthBar = new Graphics();
        this.healthBar.beginFill(0x00ff00);
        this.healthBar.lineStyle(0);
        const width = (this.currentHp / this.maxHp) * TILE_SIZE;
        this.healthBar.drawRect(0, 0, width, 4);
        this.addChild(this.healthBar);
    }
}
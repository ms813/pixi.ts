import {Movable} from '@app/game/actor/movable';
import {Game} from '@app/game/game';
import loader = PIXI.loader;
import Sprite = PIXI.Sprite;

export class Enemy extends Movable {

    constructor(id: string) {
        super(id);
        this.sprite = new Sprite(loader.resources['player'].texture);

        this.sprite.tint = 0xff0000;
    }

    doTurn(): Enemy {


        Game.turnClock.scheduleTurn(this, this._moveSpeed);
        return this;
    }
}
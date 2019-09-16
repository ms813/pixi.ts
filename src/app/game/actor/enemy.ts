import {Movable} from '@app/game/actor/movable';
import {Game} from '@app/game/game';
import {LevelMap} from '@app/game/map/level-map';
import {Direction} from '@app/game/util/direction.enum';
import {Utils} from '@app/game/util/utils';
import {loader, Sprite} from 'pixi.js';

export class Enemy extends Movable {

    constructor(id: string, private map: LevelMap) {
        super(id);
        this.sprite = new Sprite(loader.resources['player'].texture);

        this.sprite.tint = 0xff0000;
        this.visible = false;
        this.map.addEnemy(this);
    }

    doTurn(delay: number = this.moveSpeed): Enemy {
        const {x, y} = this;
        let dir: Direction;
        do {
            dir = Utils.randomEnum(Direction);

        } while (!this.map.isLegalMove(x, y, dir));

        this.move(dir, true);

        Game.turnClock.scheduleTurn(this, delay);
        return this;
    }
}
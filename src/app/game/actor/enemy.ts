import {Movable} from '@app/game/actor/movable';
import {Game} from '@app/game/game';
import {LevelMap} from '@app/game/map/level-map';
import {loader, Point, Sprite} from 'pixi.js';
import {DirectionHelper} from '@app/game/util';

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
        let dir: Point;
        do {
            dir = DirectionHelper.random();
            console.log('enemy move: ', dir);
        } while (!this.map.isLegalMove(x, y, dir));

        this.move(dir, true);

        Game.turnClock.scheduleTurn(this, delay);
        return this;
    }
}
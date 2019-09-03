import {Movable} from '@app/game/actor/movable';

export class Enemy extends Movable {


    doTurn(): Enemy {
        console.log('enemy turn');
        return this;
    }

}
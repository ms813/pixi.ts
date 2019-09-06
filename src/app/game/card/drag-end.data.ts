import {Tile} from '@app/game/map/tile';
import {Enemy} from '@app/game/actor/enemy';
import {Card} from '@app/game/card/card';

export interface DragEndData {
    pX: number;
    pY: number;
    x: number;
    y: number;
    tile: Tile;
    card: Card;
    enemy?: Enemy;
}
import {Tile} from '@app/game/map/tile/tile';
import {Card} from '@app/game/card/card';
import {Player} from '@app/game/actor/player';
import {Movable} from '@app/game/actor/movable';

export interface DragEndData {
    pX: number;
    pY: number;
    x: number;
    y: number;
    card: Card;
    player: Player;
    tile?: Tile;
    target?: Movable;
}
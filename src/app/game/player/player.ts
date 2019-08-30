import {Deck} from '../deck/deck.model';
import {TILE_WIDTH} from '@app/game/game';
import {Direction} from '@app/game/direction.enum';
import Sprite = PIXI.Sprite;
import loader = PIXI.loader;

export class Player {
    private drawPile: Deck;
    private discardPile: Deck;
    private burnPile: Deck;
    private hand: Deck;
    private deck: Deck;

    private _sprite: Sprite;

    constructor(deck: Deck) {
        this.deck = deck;
        this.drawPile = new Deck(deck.cards);
        this.discardPile = new Deck();
        this.burnPile = new Deck();
        this.hand = new Deck();

        this.sprite = new Sprite(loader.resources['player'].texture);
    }


    get sprite(): PIXI.Sprite {
        return this._sprite;
    }

    set sprite(value: PIXI.Sprite) {
        this._sprite = value;
    }

    get x(): number {
        return this.sprite.x / TILE_WIDTH;
    }

    set x(x: number) {
        this.sprite.x = TILE_WIDTH * x;
    }

    get y(): number {
        return this.sprite.y / TILE_WIDTH;
    }

    set y(y: number) {
        this.sprite.y = TILE_WIDTH * y;
    }

    move(direction: Direction, isLegalMove: boolean) {
        if (isLegalMove) {
            moveFnMap[direction](this);
        }

        return {x: this.x, y: this.y};
    }
}

const moveFnMap = {
    [Direction.N]: (p: Player) => --p.y,
    [Direction.NE]: (p: Player) => {
        ++p.x;
        --p.y;
    },
    [Direction.E]: (p: Player) => ++p.x,
    [Direction.SE]: (p: Player) => {
        ++p.x;
        ++p.y;
    },
    [Direction.S]: (p: Player) => ++p.y,
    [Direction.SW]: (p: Player) => {
        --p.x;
        ++p.y;
    },
    [Direction.W]: (p: Player) => --p.x,
    [Direction.NW]: (p: Player) => {
        --p.x;
        --p.y;
    }
};
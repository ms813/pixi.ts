import {Deck} from '../deck/deck';
import {Movable} from '@app/game/actor/movable';
import {Card} from '@app/game/card/card';
import {Game} from '@app/game/game';
import {Direction} from '@app/game/direction.enum';
import Sprite = PIXI.Sprite;
import loader = PIXI.loader;
import Point = PIXI.Point;

export class Player extends Movable {
    private _drawPile: Deck;
    private _discardPile: Deck;
    private _burnPile: Deck;
    private _hand: Deck;
    private _deck: Deck;
    public visionRadius = 5;
    public detectionRadius = 0; // can see enemies even through walls up to this radius

    private _drawCooldown: number = 500;
    private _currentDrawCooldown: number;

    public maxHandSize: number = 5;

    public onDraw: ((...cards: Card[]) => void)[];
    public onDiscard: ((...cards: Card[]) => void)[];

    constructor(deck: Deck) {
        super('player');
        this.deck = deck.shuffle();
        console.log(this.deck.cards.map(c => c.name));
        this.deck.cards.forEach(c => c.onDiscard.push(
            () => this.discard(c)
        ));

        this.drawPile = new Deck(deck.cards);
        this.discardPile = new Deck();
        this.burnPile = new Deck();
        this.hand = new Deck();

        this.currentDrawCooldown = this.drawCooldown;

        console.log(this.drawPile, this.hand, this.discardPile);

        this.sprite = new Sprite(loader.resources['player'].texture);
        this.sprite.tint = 0x000000;
    }

    public doTurn(delay: number): Player {
        this.currentDrawCooldown -= delay;
        console.debug(`Player::move - Draw cooldown: ${this.currentDrawCooldown}`);
        if (this.currentDrawCooldown <= 0) {
            this.draw();
            this.currentDrawCooldown = this.drawCooldown;
        }

        console.debug('Player::doTurn - turn start');
        Game.turnClock.scheduleTurn(this, delay);
        Game.turnClock.nextTurn();
        return this;
    }

    public draw(): Card[] {

        if (this.drawPile.length === 0 && this.discardPile.length === 0) {
            console.debug(`Player::draw attempted to draw a card, but both draw and discard piles are empty!`);
            return [];
        }

        if (this.drawPile.length === 0) {
            // shuffle discard into draw
            this.shuffleDiscardIntoDraw();
        }

        // Hand is full, move the oldest card to discard
        if (this.hand.length >= this.maxHandSize) {
            this.discard();
        }

        const newlyDrawnCards: Card[] = this.drawPile.pop();
        this.onDraw.forEach(fn => fn(...newlyDrawnCards));
        this.hand.push(...newlyDrawnCards);
        console.debug('Player::draw - Hand after draw: ', this.hand);
        return newlyDrawnCards;
    }

    public discard(...cards: Card[]): Card[] {
        if (cards.length > 0) {
            cards.forEach(this.hand.remove);
        } else {
            cards = this.hand.shift();
        }

        this.discardPile.push(...cards);
        this.onDiscard.forEach(fn => fn(...cards));
        return cards;
    }

    move(direction: Direction, isLegalMove: boolean): { x: number, y: number } {
        const prevPos = {x: this.x, y: this.y};
        if (isLegalMove) {
            const movePos = super.move(direction, isLegalMove);


            this.doTurn(this.moveSpeed);
            return movePos;
        } else {
            console.debug(`Player::move - Attempted illegal move, no turn performed`);
            return prevPos;
        }
    }

    private shuffleDiscardIntoDraw() {
        const cards: Card[] = this.discardPile.pop(this.discardPile.length);
        this.drawPile.push(...cards);
        this.drawPile.shuffle();
    }

    get drawPile(): Deck {
        return this._drawPile;
    }

    set drawPile(value: Deck) {
        this._drawPile = value;
    }

    get discardPile(): Deck {
        return this._discardPile;
    }

    set discardPile(value: Deck) {
        this._discardPile = value;
    }

    get burnPile(): Deck {
        return this._burnPile;
    }

    set burnPile(value: Deck) {
        this._burnPile = value;
    }

    get hand(): Deck {
        return this._hand;
    }

    set hand(value: Deck) {
        this._hand = value;
    }

    get deck(): Deck {
        return this._deck;
    }

    set deck(value: Deck) {
        this._deck = value;
    }

    get drawCooldown(): number {
        return this._drawCooldown;
    }

    set drawCooldown(value: number) {
        this._drawCooldown = value;
    }

    get currentDrawCooldown(): number {
        return this._currentDrawCooldown;
    }

    set currentDrawCooldown(value: number) {
        this._currentDrawCooldown = value;
    }

    public get position(): Point {
        return this.sprite.position;
    }

    public set position(position: Point) {
        this.sprite.position = position;
    }

}
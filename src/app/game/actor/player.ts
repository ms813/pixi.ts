import {Deck} from '../deck/deck';
import {Movable} from '@app/game/actor/movable';
import {Card} from '@app/game/card/card';
import Sprite = PIXI.Sprite;
import loader = PIXI.loader;

export class Player extends Movable {
    private _drawPile: Deck;
    private _discardPile: Deck;
    private _burnPile: Deck;
    private _hand: Deck;
    private _deck: Deck;

    private _drawCooldown: number;
    private _currentDrawCooldown: number;

    private _moveSpeed: number = 100;

    public maxHandSize: number = 5;

    public onDraw: ((...cards: Card[]) => void)[];
    public onDiscard: ((...cards: Card[]) => void)[];

    constructor(deck: Deck) {
        super();
        this.deck = deck.shuffle();
        console.log(this.deck.cards.map(c => c.name));

        this.drawPile = new Deck(deck.cards);
        this.discardPile = new Deck();
        this.burnPile = new Deck();
        this.hand = new Deck();

        this.currentDrawCooldown = this.drawCooldown;

        console.log(this.drawPile, this.hand, this.discardPile);

        this.sprite = new Sprite(loader.resources['player'].texture);
    }

    public draw(): Card[] {

        if (this.drawPile.length === 0 && this.discardPile.length === 0) {
            console.log(`Player::draw attempted to draw a card, but both draw and discard piles are empty!`);
            return [];
        }

        if (this.drawPile.length === 0) {
            // shuffle discard into draw
            this.shuffleDiscardIntoDraw();
        }

             // Hand is full, move the oldest card to discard
        if (this.hand.length >= this.maxHandSize) {
            const cardsToDiscard: Card[] = this.hand.shift();
            this.discardPile.push(...cardsToDiscard);
            this.onDiscard.forEach(fn => fn(...cardsToDiscard));
        }

        //draw the next n cards
        const newlyDrawnCards: Card[] = this.drawPile.pop();
        this.onDraw.forEach(fn => fn(...newlyDrawnCards));
        this.hand.push(...newlyDrawnCards);

        return newlyDrawnCards;
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

    private shuffleDiscardIntoDraw() {
        const cards: Card[] = this.discardPile.pop(this.discardPile.length);
        this.drawPile.push(...cards);
        this.drawPile.shuffle();
    }
}
import {Card} from '../card/card';

export class Deck {

    private _cards: Card[];

    constructor(cards: Card[] = []) {
        this.cards = cards;
    }

    public push(card: Card) {
        this.cards.push(card);
    }

    public pop(): Card {
        return this._cards.pop();
    }

    public peek(): Card {
        return this.cards[this._cards.length - 1];
    }

    public get cards(): Card[] {
        return this._cards.slice();
    }

    public set cards(cards: Card[]) {
        this._cards = cards;
    }
}
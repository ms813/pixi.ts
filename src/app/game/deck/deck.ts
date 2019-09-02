import {Card} from '../card/card';
import {getRandomInt} from '@app/utils';
import {CardView} from '@app/game/card/card.view';

export class Deck {

    private _cards: Card[];

    constructor(cards: Card[] = []) {
        this.cards = cards;
        console.debug(`Deck::new, length: ${cards.length}`);
    }

    public shuffle(): Deck {
        console.debug('Deck::shuffle', this.cards);
        for (let i = this.cards.length - 1; i > 1; i--) {
            const j: number = getRandomInt(0, i);
            const temp = this._cards[i];
            this._cards[i] = this._cards[j];
            this._cards[j] = temp;
        }
        console.debug(`Deck::shuffle finished`, this.cards);

        return this;
    }

    public getCardViews(): CardView[] {
        return this.cards.map((c: Card) => new CardView(c));
    }

    public shift(n: number = 1): Card[] {
        return this.cards.splice(0, n);
    }

    public unshift(...cards: Card[]): number {
        return this.cards.unshift(...cards);
    }

    public push(...cards: Card[]) {
        this.cards.push(...cards);
    }

    public pop(n: number = 1): Card[] {
        return this._cards.splice(-n, n);
    }

    public peek(): Card {
        return this.cards[this._cards.length - 1];
    }

    public get cards(): Card[] {
        return this._cards;
    }

    public set cards(cards: Card[]) {
        this._cards = cards;
    }

    public get length(): number {
        return this._cards.length;
    }
}
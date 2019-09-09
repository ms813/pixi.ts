import {Card} from '@app/game/card/card';
import {DragEndData} from '@app/game/card/drag-end.data';

const CardData: { version: number, cards: { [key: string]: CardDefinition } } = require('../data/cards.json');

export class CardDictionary {
    static get(name: string): Card {
        return new CardBuilder(CardData.cards[name]).build();
    }
}

export interface CardDefinition {
    name: string;
    displayName: string;
    targeting: string;
    range: number;
    speed: number;
    onPlay: CardActionDefinition;
    onDraw: CardActionDefinition;
    onDiscard: CardActionDefinition;
    onAddToDeck: CardActionDefinition;
}

export interface CardActionDefinition {
    action: string;
    value?: number
}

export const CardActionDictionary: { [key: string]: (defn: CardActionDefinition) => (d: DragEndData, options?: any) => any } = {
    damage: (defn: CardActionDefinition) => ({target}: DragEndData) => target.currentHp -= defn.value,
    heal: (defn: CardActionDefinition) => ({target}: DragEndData) => target.currentHp += defn.value
};

class CardBuilder {
    private card: Card;
    private defn: CardDefinition;

    constructor(defn: CardDefinition) {
        this.defn = defn;
        this.card = new Card(defn);
        this.buildOnPlay().buildOnDiscard();
    }

    buildOnPlay(): CardBuilder {
        this.card.onPlay.push(({x, y}: DragEndData) => console.debug(`Card ${name} played at (${x}, ${y})`));
        const fn = CardActionDictionary[this.defn.onPlay.action];
        this.card.onPlay.push(fn(this.defn.onPlay));
        return this;
    }

    buildOnDiscard(): CardBuilder {
        this.card.onDiscard.push(() => console.debug(`CardBuilder - Discarding ${this.card.name}`));
        return this;
    }

    build(): Card {
        return this.card;
    }
}

import {Card} from '@app/game/card/card';
import {DragEndData} from '@app/game/card/drag-end.data';

const CardData: { version: number, cards: { [key: string]: CardDefinition } } = require('../data/cards.json');

export class CardDictionary {
    static get(name: string): Card {
        return new CardBuilder(CardData.cards[name])
        .buildOnPlay()
        .build();
    }
}

export interface CardDefinition {
    name: string;
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
    damage: (defn: CardActionDefinition) => ({enemy}: DragEndData) => enemy.hp -= defn.value
};

class CardBuilder {
    private card: Card;
    private defn: CardDefinition;

    constructor(defn: CardDefinition) {
        this.card = new Card(defn);
        this.defn = defn;
    }

    buildOnPlay(): CardBuilder {
        this.card.onPlay.push(({x, y}: DragEndData) => console.log(`Card ${name} played at (${x}, ${y})`));

        const fn = CardActionDictionary[this.defn.onPlay.action];
        this.card.onPlay.push(fn(this.defn.onPlay));
        return this;
    }

    build(): Card {
        return this.card;
    }
}

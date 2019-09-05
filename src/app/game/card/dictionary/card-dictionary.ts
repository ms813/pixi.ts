import {Card} from '@app/game/card/card';

const CardData: { version: number, cards: { [key: string]: CardDefinition } } = require('../data/cards.json');

export class CardDictionary {
    static get(name: string): Card {
        return new Card(CardData.cards[name]);
    }
}

export interface CardDefinition {
    name: string;
    targeting: string;
    range: number;
    onPlay: CardActionDefinition;
    onDraw: CardActionDefinition;
    onDiscard: CardActionDefinition;
    onAddToDeck: CardActionDefinition
}

export interface CardActionDefinition {
    action: string;
    value?: number
}

export const CardActionDictionary = {};
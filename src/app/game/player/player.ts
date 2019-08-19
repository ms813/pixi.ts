import {Deck} from '../deck/deck.model';

export class Player {
    private drawPile: Deck;
    private discardPile: Deck;
    private burnPile: Deck;
    private hand: Deck;
    private deck: Deck;
}
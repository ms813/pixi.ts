import {CardView} from '@app/game/card/card.view';

export class Card {

    public name: string;

    public view: CardView;

    constructor(name: string) {
        this.name = name;
        this.view = new CardView(this);
    }
}
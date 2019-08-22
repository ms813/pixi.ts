import {Deck} from '@app/game/deck/deck.model';
import {CardView} from '@app/game/card/card.view';
import {Card} from '@app/game/card/card';
import {Scene} from '@app/game/scene/scene';
import {Key} from '@app/game/keyboard.event';
import {SceneManager} from '@app/game/scene/scene-manager';
import Container = PIXI.Container;
import Ticker = PIXI.ticker.Ticker;


export class DeckScene extends Scene {

    private cardViews: CardView[];

    constructor(
        id: string,
        deck: Deck
    ) {
        super(id, new Container(), new Ticker());
        this.keys = this.getKeybindings();
        this.cardViews = deck.cards.map((card: Card, i: number) => new CardView(card, i * 100, 100));
        this.cardViews.forEach(cardView => this.container.addChild(cardView));
    }

    private getKeybindings(): Key[] {
        const left = Key.create('ArrowLeft');
        left.press = () => console.log('left');

        const space = Key.create(' ');
        space.press = () => SceneManager.goToScene('menu');

        return [left, space];
    }
}
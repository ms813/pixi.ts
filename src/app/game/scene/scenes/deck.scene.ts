import {Deck} from '../../deck/deck';
import {CardView} from '../../card/card.view';
import {Card} from '../../card/card';
import {Scene} from '../scene';
import {Key} from '../../keyboard.event';
import {SceneManager} from '../scene-manager';
import {Button} from '@app/game/ui/button';
import {Game} from '@app/game/game';
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
        this.cardViews = deck.cards.map((card: Card, i: number) => new CardView(card, i * CardView.width, CardView.height));
        this.cardViews.forEach(cardView => this.container.addChild(cardView));

        const button: Button = new Button(
            'Back',
            Game.width / 2 - 16,
            2 * Game.height / 3,
            SceneManager.goToPreviousScene
        );

        this.addChild(button)
    }

    private getKeybindings(): Key[] {
        const left = Key.create('ArrowLeft');
        left.press = () => console.log('left');

        const space = Key.create(' ');
        space.press = () => SceneManager.goToScene('menu');

        return [left, space];
    }
}
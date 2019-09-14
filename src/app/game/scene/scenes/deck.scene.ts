import {Deck} from '@app/game/deck';
import {Card, PlayableCardView} from '@app/game/card';
import {Scene} from '../scene';
import {Key} from '../../keyboard.event';
import {SceneManager} from '@app/game/scene';
import {Button} from '@app/game/ui/button';
import {Game} from '@app/game/game';
import {Container, ticker} from 'pixi.js';
import {CardView} from '@app/game/card/card.view';
import Ticker = ticker.Ticker;

export class DeckScene extends Scene {

    private cardViews: CardView[];

    constructor(
        id: string,
        deck: Deck
    ) {
        super(id, new Container(), new Ticker());
        this.keys = this.getKeybindings();
        this.cardViews = deck.cards.map((card: Card, i: number) => new CardView(card, i * PlayableCardView.width, PlayableCardView.height));
        this.cardViews.forEach(cardView => this.container.addChild(cardView));

        const button: Button = new Button(
            'Back',
            Game.width / 2 - 16,
            2 * Game.height / 3,
            SceneManager.goToPreviousScene
        );

        this.addChild(button);
    }

    private getKeybindings(): Key[] {
        const left = Key.create('ArrowLeft');
        left.press = () => console.log('left');

        const space = Key.create('Space');
        space.press = () => SceneManager.goToScene('menu');

        return [left, space];
    }
}
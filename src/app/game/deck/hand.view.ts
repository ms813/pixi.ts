import Container = PIXI.Container;
import DisplayObject = PIXI.DisplayObject;
import Text = PIXI.Text;
import TextStyleOptions = PIXI.TextStyleOptions;
import {Player} from '@app/game/actor/player';
import {CardView} from '@app/game/card/card.view';
import {Game} from '@app/game/game';
import {Card} from '@app/game/card/card';

export class HandView extends Container {

    private readonly textStyleOptions: TextStyleOptions = {
        fontFamily: 'Arial',
        fontSize: 14,
        fill: 0x000000
    };

    private player: Player;

    private handContainer: Container;
    private drawContainer: Container;
    private discardContainer: Container;

    private spacing: number = 32;

    constructor(player: Player) {
        super();
        this.player = player;
        this.handContainer = new Container();
        this.drawContainer = new Container();
        this.discardContainer = this.initDiscardContainer();
        this.draw = this.draw.bind(this);
        this.discard = this.discard.bind(this);

        this.addChild(this.handContainer);
        this.addChild(this.discardContainer);
    }

    private initDiscardContainer(): Container {
        const container = new Container();
        container.x = Game.width - CardView.width - this.spacing;
        container.y = Game.height - CardView.height;

        const countText = new Text(this.getDiscardCountText(), this.textStyleOptions);
        countText.name = 'discardCountText';
        container.addChild(countText);

        return container;
    }

    draw(...cards: Card[]) {
        console.debug(`HandView::draw`, ...cards);
        //move all the other cards along one
        this.handContainer.children.forEach((c: DisplayObject) => {
            c.x += cards.length * (CardView.width + this.spacing);
        });

        cards.forEach((card: Card, i: number) => {
            card.view.x = i * (CardView.width + this.spacing);
            card.view.y = Game.height - CardView.height - this.spacing;
        });

        this.handContainer.addChild(...cards.map(c => c.view));
    }

    discard(...cards: Card[]) {
        console.debug(`HandView::discard`, ...cards);
        cards.forEach(({view}: { view: CardView }) => this.handContainer.removeChild(view));

        const countText: Text = this.discardContainer.getChildByName('discardCountText');
        countText.text = this.getDiscardCountText();
    }

    private getDiscardCountText(): string {
        return `Discard pile: ${this.player.discardPile.length.toString()}`;
    }
}
import Container = PIXI.Container;
import DisplayObject = PIXI.DisplayObject;
import Text = PIXI.Text;
import TextStyleOptions = PIXI.TextStyleOptions;
import Graphics = PIXI.Graphics;
import Rectangle = PIXI.Rectangle;
import InteractionData = PIXI.interaction.InteractionData;
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
        this.drawContainer = this.initDrawContainer();
        this.discardContainer = this.initDiscardContainer();
        this.draw = this.draw.bind(this);
        this.discard = this.discard.bind(this);
        this.y = Game.height - CardView.height - this.spacing;

        this.addChild(this.handContainer);
        this.addChild(this.discardContainer);
        this.addChild(this.drawContainer);

        this.refreshDrawCountString();
        this.refreshDiscardCountString();
    }

    private initDrawContainer(): Container {
        const container = new Container();
        container.x = this.spacing;

        const countText = new Text('', this.textStyleOptions);
        countText.name = 'drawCountText';
        container.addChild(countText);

        const border: Graphics = new Graphics();
        border.lineStyle(1, 0x00ff00);
        border.drawRect(0, 0, 100, 100);
        border.interactive = true;
        border.hitArea = new Rectangle(0, 0, 100, 100);
        //@ts-ignore
        border.mouseover = (e: InteractionData) => console.log(`Moused over draw container`);
        container.addChild(border);

        return container;
    }

    private initDiscardContainer(): Container {
        const container = new Container();
        container.x = Game.width - CardView.width - this.spacing;

        const countText = new Text('', this.textStyleOptions);
        countText.name = 'discardCountText';
        container.addChild(countText);

        const border: Graphics = new Graphics();
        border.lineStyle(1, 0xff0000);
        border.drawRect(0, 0, 100, 100);
        border.interactive = true;
        border.hitArea = new Rectangle(0, 0, 100, 100);
        //@ts-ignore
        border.mouseover = (e: InteractionData) => console.log(`Moused over discard container`);
        container.addChild(border);

        return container;
    }

    draw(...cards: Card[]) {
        console.debug(`HandView::draw`, ...cards);

        this.refreshDrawCountString();

        // move all the other cards along one
        this.handContainer.children.forEach((c: DisplayObject) => {
            c.x += cards.length * (CardView.width + this.spacing);
        });

        // add the newly drawn cards at the left of the hand
        cards.forEach((card: Card, i: number) => {
            // i + 1, + spacing, accounts for the draw pile container
            card.view.x = (i + 1) * (CardView.width + this.spacing) + this.spacing;
        });

        this.handContainer.addChild(...cards.map(c => c.view));
    }

    discard(...cards: Card[]) {
        console.debug(`HandView::discard`, ...cards);
        cards.forEach(({view}: { view: CardView }) => this.handContainer.removeChild(view));
        this.refreshDiscardCountString();
    }

    private refreshDiscardCountString(): Text {
        const countText: Text = this.discardContainer.getChildByName('discardCountText');
        countText.text = `Discard pile: ${this.player.discardPile.length.toString()}`;
        return countText;
    }

    private refreshDrawCountString() {
        const countText: Text = this.drawContainer.getChildByName('drawCountText');
        countText.text = `Draw pile: ${this.player.drawPile.length.toString()}`;
        return countText;
    }
}
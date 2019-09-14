import {Player} from '@app/game/actor/player';
import {CardView} from '@app/game/card/card.view';
import {Game} from '@app/game/game';
import {Card} from '@app/game/card/card';
import {SceneManager} from '@app/game/scene/scene-manager';
import {DeckScene} from '@app/game/scene/scenes/deck.scene';
import {Deck} from '@app/game/deck/deck';
import {Container, DisplayObject, Graphics, interaction, Rectangle, Text, TextStyleOptions} from 'pixi.js';
import InteractionData = interaction.InteractionData;

export class HandView extends Container {

    private readonly textStyleOptions: TextStyleOptions = {
        fontFamily: 'Arial',
        fontSize: 14,
        fill: 0x000000
    };

    private player: Player;

    private readonly handContainer: Container;
    private readonly drawContainer: Container;
    private readonly discardContainer: Container;

    private spacing: number = 16;
    private maxHandContainerCards: number = 5;

    constructor(player: Player) {
        super();
        this.initBackground();
        this.player = player;
        this.maxHandContainerCards = this.player.maxHandSize;
        this.handContainer = this.initHandContainer();
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

    private initBackground(): Graphics {
        const bg = new Graphics();
        bg.beginFill(0xababab);
        bg.lineStyle(1, 0x000000);
        bg.drawRect(0, -this.spacing, Game.width, CardView.height + this.spacing * 2);
        this.addChild(bg);
        return bg;
    }

    private initHandContainer(): Container {
        const container = new Container();
        container.x = CardView.width + 2 * this.spacing;
        return container;
    }

    private initDrawContainer(): Container {
        const container = new Container();
        container.x = this.spacing;

        const countText = new Text('', this.textStyleOptions);
        countText.name = 'drawCountText';
        container.addChild(countText);

        const border: Graphics = new Graphics();
        border.lineStyle(1, 0x00ff00);
        border.drawRect(0, 0, CardView.width, CardView.height);
        border.interactive = true;
        border.hitArea = new Rectangle(0, 0, CardView.width, CardView.height);
        //@ts-ignore
        border.mouseover = (e: InteractionData) => console.log(`Moused over draw container`);

        //@ts-ignore
        border.click = (e: InteractionData) => this.showDeckView('draw-container', this.player.drawPile);
        container.addChild(border);

        return container;
    }

    private initDiscardContainer(): Container {
        const container = new Container();
        container.x = (this.maxHandContainerCards + 1) * (CardView.width + this.spacing) + this.spacing;

        const countText = new Text('', this.textStyleOptions);
        countText.name = 'discardCountText';
        container.addChild(countText);

        const border: Graphics = new Graphics();
        border.lineStyle(1, 0xff0000);
        border.drawRect(0, 0, CardView.width, CardView.height);
        border.interactive = true;
        border.hitArea = new Rectangle(0, 0, CardView.width, CardView.height);

        //@ts-ignore
        border.click = (e: InteractionData) => this.showDeckView('discard-container', this.player.discardPile);

        container.addChild(border);

        return container;
    }

    draw(card: Card) {
        console.debug(`HandView::draw`, card);

        this.refreshDrawCountString();
        const cardMoveSpeedPerFrame = 5;
        // move all the other cards along one
        const slideCardRight = (c: DisplayObject, endX: number, delta: number, self: (...args: any[]) => any) => {
            if (c.x >= endX) {
                SceneManager.currentScene.ticker.remove(self);
                c.x = endX;
                return;
            }
            c.x += cardMoveSpeedPerFrame * delta;
        };

        const ticker = SceneManager.currentScene.ticker;
        // add the newly drawn cards at the left of the hand
        card.view.y = 0;
        card.view.x = -CardView.width - this.spacing;
        this.handContainer.addChild(card.view);

        const animate = (delta: number) => slideCardRight(card.view, 0, delta, animate);
        ticker.add(animate);

        //slide all the cards along
        this.player.hand.cards.forEach((c: Card) => {
            const pos: number = c.view.x / (this.spacing + CardView.width);
            if (this.player.hand.cards.length > pos) {
                const endX = c.view.x + CardView.width + this.spacing;
                const animate = (delta: number) => slideCardRight(c.view, endX, delta, animate);
                ticker.add(animate);
            }
        });
    }

    discard(...cards: Card[]) {
        console.debug(`HandView::discard`, ...cards.map(c => c.name));
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

    private showDeckView(id: string, deck: Deck): void {
        SceneManager.addScene(new DeckScene(id, deck), {overwrite: true});
        SceneManager.goToScene(id);
    }
}
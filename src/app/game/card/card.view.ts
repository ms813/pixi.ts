import Container = PIXI.Container;
import Text = PIXI.Text;
import TextStyleOptions = PIXI.TextStyleOptions;
import Graphics = PIXI.Graphics;
import Rectangle = PIXI.Rectangle;
import InteractionData = PIXI.interaction.InteractionData;
import {Card} from '@app/game/card/card';

export class CardView extends Container {

    private nameText: Text;
    public static readonly width: number = 96;
    public static readonly height: number = 128;

    private readonly textStyleOptions: TextStyleOptions = {
        fontFamily: 'Arial',
        fontSize: 14,
        fill: 0x000000
    };


    constructor(private card: Card, x: number = 0, y: number = 0) {
        super();

        this.x = x;
        this.y = y;

        const border: Graphics = new Graphics();
        console.debug(`CardView:: ${card.name}: (${x}, ${y})`);
        border.lineStyle(1, 0x000000);
        border.drawRect(0, 0,  CardView.width,  CardView.height);
        border.interactive = true;
        border.hitArea = new Rectangle(0, 0, CardView.width, CardView.height);
        // @ts-ignore
        // border.mouseover = (e: InteractionData) => console.log(`Moused over card: ${card.name}`);
        this.nameText = new Text(card.name, this.textStyleOptions);

        this.addChild(border);
        this.addChild(this.nameText);
    }
}
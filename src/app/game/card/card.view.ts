import Container = PIXI.Container;
import Text = PIXI.Text;
import TextStyleOptions = PIXI.TextStyleOptions;
import Graphics = PIXI.Graphics;
import Rectangle = PIXI.Rectangle;
import InteractionData = PIXI.interaction.InteractionData;
import {Card} from '@app/game/card/card';

export class CardView extends Container {

    private nameText: Text;

    private readonly options: TextStyleOptions = {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0x000000
    };

    constructor(private card: Card, x: number, y: number) {
        super();

        this.x = x;
        this.y = y;

        const border: Graphics = new Graphics();
        console.log(`${card.name}: (${x}, ${y})`);
        border.lineStyle(1, 0x000000);
        border.drawRect(0, 0, 100, 100);
        border.interactive = true;
        border.hitArea = new Rectangle(0, 0, 100, 100);
        border.mouseover = (e: InteractionData) => console.log(`Moused over card: ${card.name}`);

        this.nameText = new Text(card.name, this.options);

        this.addChild(border);
        this.addChild(this.nameText);
    }
}
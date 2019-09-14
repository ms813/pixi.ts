import {Container, Graphics, interaction, Text, TextStyleOptions} from 'pixi.js';
import {Card} from '@app/game/card/card';

export class CardView extends Container {

    protected nameText: Text;
    public static readonly width: number = 96;
    public static readonly height: number = 128;
    protected border: Graphics;

    private readonly textStyleOptions: TextStyleOptions = {
        fontFamily: 'Arial',
        fontSize: 14,
        fill: 0x000000
    };

    constructor(protected card: Card, x: number = 0, y: number = 0) {
        super();
        this.x = x;
        this.y = y;


        this.border = this.initBorder();
        this.addChild(this.border);

        this.nameText = this.initNameText();
        this.addChild(this.nameText);
    }

    protected initBorder(): Graphics {
        const border: Graphics = new Graphics();
        console.debug(`CardView::new - ${this.card.name}: (${this.x}, ${this.y})`);
        border.lineStyle(1, 0x00ffff);
        border.drawRect(0, 0, CardView.width, CardView.height);
        return border;
    }

    protected initNameText(): Text {
        return new Text(this.card.displayName, this.textStyleOptions);
    }
}

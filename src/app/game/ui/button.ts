import Container = PIXI.Container;
import Sprite = PIXI.Sprite;
import Text = PIXI.Text;
import TextStyleOptions = PIXI.TextStyleOptions;
import DisplayObject = PIXI.DisplayObject;
import loader = PIXI.loader;
import Resource = PIXI.loaders.Resource;

export class Button {

    private sprite: Sprite;
    private resources: Resource;
    public container: Container;

    private readonly textStyleOptions: TextStyleOptions = {
        fontFamily: 'Arial',
        fontSize: 14,
        fill: 0x000000
    };

    constructor(
        private text: string,
        x: number,
        y: number,
        private onDown: any,
        private onUp: any,
        private onOver: any,
        private onOut: any
    ) {
        this.resources = loader.resources['button'];

        this.container = new Container();
        console.log(loader.resources);
        this.sprite = new Sprite(this.resources.textures['button_up.png']);
        this.addChild(this.sprite);

        const textView = new Text(text, this.textStyleOptions);
        textView.anchor.set(0.5);
        textView.x = this.container.width / 2;
        textView.y = this.container.height / 2;
        this.addChild(textView);


        this.x = x;
        this.y = y;
        this.container.interactive = true;
        this.container.buttonMode = true;

        this.bindButtonCallbacks();
    }

    public get x() {
        return this.container.x;
    }

    public get y() {
        return this.container.y;
    }

    public set x(x: number) {
        this.container.x = x;
    }

    public set y(y: number) {
        this.container.y = y;
    }

    public addChild(...children: DisplayObject[]): DisplayObject {
        return this.container.addChild(...children);
    }

    public on(event: string | symbol, fn: (...args: any[]) => any, context?: any): DisplayObject {
        return this.container.on(event, fn, context);
    }

    bindButtonCallbacks() {
        const {textures} = this.resources;
        this.on('pointerdown', () => {
            this.sprite.texture = textures['button_down.png'];
            this.onDown();
        })
        .on('pointerup', () => {
            this.sprite.texture = textures['button_over.png'];
            this.onUp();
        })
        .on('pointerupoutside', () => {
            this.sprite.texture = textures['button_up.png'];
            this.onUp();
        })
        .on('pointerover', () => {
            this.sprite.texture = textures['button_over.png'];
            this.onOver();
        })
        .on('pointerout', () => {
            this.sprite.texture = textures['button_up.png'];
            this.onOut();
        });
    };
}
import Container = PIXI.Container;
import Sprite = PIXI.Sprite;
import Text = PIXI.Text;
import TextStyleOptions = PIXI.TextStyleOptions;
import loader = PIXI.loader;
import Resource = PIXI.loaders.Resource;

export class Button extends Container {

    private sprite: Sprite;
    private resources: Resource;

    private readonly textStyleOptions: TextStyleOptions = {
        fontFamily: 'Arial',
        fontSize: 14,
        fill: 0x000000
    };

    constructor(
        private text: string,
        x: number,
        y: number,
        private onDown: Function = () => {},
        private onUp: Function = () => {},
        private onOver: Function = () => {},
        private onOut: Function = () => {}
    ) {
        super();
        this.resources = loader.resources['button'];

        this.sprite = new Sprite(this.resources.textures['button_up.png']);
        this.addChild(this.sprite);

        const textView = new Text(text, this.textStyleOptions);
        textView.anchor.set(0.5);
        textView.x = this.width / 2;
        textView.y = this.height / 2;
        this.addChild(textView);


        this.x = x;
        this.y = y;
        this.interactive = true;
        this.buttonMode = true;

        this.bindButtonCallbacks();
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
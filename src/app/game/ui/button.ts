import Container = PIXI.Container;
import loader = PIXI.loader;
import Sprite = PIXI.Sprite;
import Text = PIXI.Text;
import Resource = PIXI.loaders.Resource;
import TextStyleOptions = PIXI.TextStyleOptions;

export class Button extends Container {

    private static resourcesLoaded: boolean = false;
    private sprite: Sprite;
    private resource: Resource;

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
        super();

        if (!Button.resourcesLoaded) {
            loader.add('assets/ui/button.json').load(() => {
                this.resource = loader.resources['assets/ui/button.json'];
                this.sprite = new Sprite(this.resource.textures['button_up.png']);
                this.addChild(this.sprite);

                const textView = new Text(text, this.textStyleOptions);
                textView.anchor.set(0.5);
                textView.x = this.width / 2;
                textView.y = this.height / 2;
                this.addChild(textView);
            });
            Button.resourcesLoaded = true;
        }

        this.x = x;
        this.y = y;
        this.interactive = true;
        this.buttonMode = true;

        this.bindButtonCallbacks();
    }

    bindButtonCallbacks() {
        this.on('pointerdown', () => {
            this.sprite.texture = this.resource.textures['button_down.png'];
            this.onDown();
        })
        .on('pointerup', () => {
            this.sprite.texture = this.resource.textures['button_over.png'];
            this.onUp();
        })
        .on('pointerupoutside', () => {
            this.sprite.texture = this.resource.textures['button_up.png'];
            this.onUp();
        })
        .on('pointerover', () => {
            this.sprite.texture = this.resource.textures['button_over.png'];
            this.onOver();
        })
        .on('pointerout', () => {
            this.sprite.texture = this.resource.textures['button_up.png'];
            this.onOut();
        });
    };
}
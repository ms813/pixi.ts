import {Scene} from '../scene';
import {Key} from '../../keyboard.event';
import {SceneManager} from '../scene-manager';
import Ticker = PIXI.ticker.Ticker;
import Container = PIXI.Container;
import Graphics = PIXI.Graphics;

export class TickerTestScene extends Scene {

    constructor(id: string) {
        super(id, new Container(), new Ticker());
        this.keys = this.getKeybindings();

        const bg: Graphics = new Graphics();
        bg.beginFill(0xff0000);
        bg.lineStyle(1, 0x000000);
        bg.drawRect(0, 0, 100, 100);
        this.container.addChild(bg);

        let moveLeft = true;
        this.ticker.add((delta: number) => {
            const speed = 2;
            if (bg.x < this.container.width && moveLeft) {
                bg.x += speed;
            } else {
                bg.x -= speed;
                moveLeft = bg.x <= 0;
            }
        });
    }

    private getKeybindings(): Key[] {
        const space = Key.create(' ');
        space.press = () => SceneManager.goToScene('test-deck-view');

        return [space];
    }
}
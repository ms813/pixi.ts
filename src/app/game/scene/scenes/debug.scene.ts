import {Scene} from '../scene';
import {Button} from '../../ui/button';
import Ticker = PIXI.ticker.Ticker;
import Container = PIXI.Container;

export class DebugScene extends Scene {

    constructor(id: string) {
        super(id, new Container(), new Ticker());

        const debugButton = new Button(
            'Debug button',
            0, 100,
            () => console.log('Debug button::down'),
            () => console.log('Debug button::out'),
            () => console.log('Debug button::over'),
            () => console.log('Debug button::out')
        );

        this.container.addChild(debugButton.container);
    }
}
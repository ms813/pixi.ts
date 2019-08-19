import {Scene} from '@app/game/scene';
import {Button} from '@app/game/ui/button';
import {LevelMapGenerator} from '@app/game/map/level-map.generator';
import {LevelMap} from '@app/game/map/level-map.model';
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

        this.container.addChild(debugButton);

        const map: LevelMap = new LevelMapGenerator().height(4).width(4).build();
        console.log('map:', map);
    }
}
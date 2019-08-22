import {Scene} from '@app/game/scene/scene';
import {LevelMap} from '@app/game/map/level-map';
import {LevelMapGenerator} from '@app/game/map/level-map.generator';
import Ticker = PIXI.ticker.Ticker;
import Container = PIXI.Container;

export class MapTestScene extends Scene {
    constructor(id: string) {
        super(id, new Container(), new Ticker());

        const map: LevelMap = new LevelMapGenerator()
        .height(18)
        .width(24)
        .grid(0xcccccc)
        .build();

        console.log('map:', map);

        this.addChild(map);
    }
}
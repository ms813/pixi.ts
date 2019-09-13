import {Scene} from '@app/game/scene/scene';
import {LevelMapGenerator} from '@app/game/map/level-map.generator';
import {Container, ticker} from 'pixi.js';
import Ticker = ticker.Ticker;

export class MapGenScene extends Scene {
    constructor(id: string) {
        super(id, new Container(), new Ticker());

        const generator = new LevelMapGenerator(32, 17);
    }

}
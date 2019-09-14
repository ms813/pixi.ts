import {Scene} from '@app/game/scene/scene';
import {SimpleMapGenerator} from '@app/game/map/generator/simple-map.generator';
import {Container, ticker} from 'pixi.js';
import Ticker = ticker.Ticker;

export class MapGenScene extends Scene {
    constructor(id: string) {
        super(id, new Container(), new Ticker());

        const generator = new SimpleMapGenerator(32, 17)
        .fog(false)
        .discovered(true)
        .grid(0xcccccc);


        const map = generator.build();
        this.addChild(map);

        console.log(map);
    }

}
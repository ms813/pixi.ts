import {Scene} from '@app/game/scene/scene';
import {Container, ticker} from 'pixi.js';
import {TunnelerMapGenerator} from '@app/game/map/generator';
import {TunnelerParams} from '@app/game/map/generator';
import {LevelMap} from '@app/game/map';
import {DirectionHelper} from '@app/game/util';
import Ticker = ticker.Ticker;

const TunnelerParams: TunnelerParams[] = require('../../map/generator/data/tunneler.params.json');

export class MapGenScene extends Scene {
    constructor(id: string) {
        super(id, new Container(), new Ticker());

        const testTunnelerParams: TunnelerParams = Object.assign({}, TunnelerParams.find(p => p.id === 'test-tunneler-params'));
        testTunnelerParams.x = 10;
        testTunnelerParams.y = 10;
        testTunnelerParams.direction = DirectionHelper.SOUTH;

        const generator = new TunnelerMapGenerator(50, 50)
        .fog(false)
        .withTunneler(testTunnelerParams)
        .discovered(true)
        .grid(0xcccccc);

        // this.container.scale = new Point(0.5, 0.5);
        let map: LevelMap = generator.step();
        this.addChild(map);
        const stepInterval = setInterval(() => {
            map = generator.step();
            if (generator.complete) {
                clearInterval(stepInterval);
            }
        }, 100);

    }
}



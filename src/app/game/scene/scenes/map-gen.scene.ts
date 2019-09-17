import {Scene} from '@app/game/scene/scene';
import {Container, Point, ticker} from 'pixi.js';
import {TunnelerMapGenerator, TunnelerParams} from '@app/game/map/generator';
import {LevelMap} from '@app/game/map';
import {DirectionHelper, Utils} from '@app/game/util';
import Ticker = ticker.Ticker;

const TunnelerParams: TunnelerParams[] = require('../../map/generator/data/tunneler.params.json');

export class MapGenScene extends Scene {
    constructor(id: string) {
        super(id, new Container(), new Ticker());

        const testTunnelerParams: TunnelerParams = Object.assign({}, TunnelerParams.find(p => p.id === 'test-tunneler-params'));
        testTunnelerParams.x = 10;
        testTunnelerParams.y = 10;
        testTunnelerParams.direction = DirectionHelper.SOUTH;

        let {randomInt: r} = Utils;
        const generator = new TunnelerMapGenerator(200, 200)
        .fog(false).discovered(true)
        .grid(0xcccccc);


        for (let i = 0; i < r(5, 10); i++) {
            generator.withTunneler(testTunnelerParams, r(25, 175), r(25, 175), DirectionHelper.random('cardinal'));
        }

        this.container.scale = new Point(0.1, 0.1);
        let map: LevelMap = generator.step();
        this.addChild(map);
        const stepInterval = setInterval(() => {
            map = generator.step();
            if (generator.complete) {
                clearInterval(stepInterval);
            }
        }, 1);

    }
}



import {Application, loader} from 'pixi.js';

import Container = PIXI.Container;
import {TurnClock} from '@app/game/turnclock';
import {Scene, SceneManager} from '@app/game/scene';
import {
    DebugScene,
    DeckScene,
    LevelTestScene,
    MapGenScene,
    SceneSelectScene,
    TickerTestScene
} from '@app/game/scene/scenes';
import {Card} from '@app/game/card';
import {Deck} from '@app/game/deck';

export const TILE_SIZE: number = 32;

export class Game {

    private app: Application;
    static turnClock: TurnClock = new TurnClock();

    public init(app: Application) {
        this.app = app;

        Game.loadAssets();

        loader.load(this.setup.bind(this));
        SceneManager.init(this.app);
    }

    setup(): void {
        SceneManager.addScene(new DebugScene('debug'));
        SceneManager.addScene(new TickerTestScene('ticker_test'));
        SceneManager.addScene(new LevelTestScene('level_test'));
        SceneManager.addScene(new MapGenScene('mapgen'));
        SceneManager.addScene(new SceneSelectScene('scene_select'));

        SceneManager.goToScene('level_test');
    }

    private buildDeckScene(): Scene {
        const cards: Card[] = [
            // new Card('A'),
            // new Card('B'),
            // new Card('C'),
            // new Card('D'),
        ];

        const deck = new Deck(cards);
        const deckScene = SceneManager.addScene(new DeckScene('test-deck-scene', deck));
        // append hero

        const testAnimation = new Container();

        deckScene.container.addChild(testAnimation);
        // SceneManager.goToScene('test-deck-scene');
        return deckScene;
    }

    private paused: boolean = false;

    public pause(): boolean {
        this.paused = !this.paused;
        if (this.paused) {
            this.app.ticker.stop();
        } else {
            this.app.ticker.start();
        }
        return this.paused;
    }

    private static loadAssets() {
        loader.add('button', 'assets/ui/button.json');
        loader.add('map_tiles', '/assets/map/map_tiles.json');
        loader.add('player', '/assets/player.png');
    }

    public static get width(): number {
        return 1080;
    }

    public static get height(): number {
        return 720;
    }
}
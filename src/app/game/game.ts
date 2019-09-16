import {Application, loader} from 'pixi.js';
import {TurnClock} from '@app/game/turnclock';
import {SceneManager} from '@app/game/scene';
import {DebugScene, LevelTestScene, MapGenScene, SceneSelectScene, TickerTestScene} from '@app/game/scene/scenes';

export const TILE_SIZE: number = 32;

export class Game {

    public static height = 930;
    public static width = 952;

    private app: Application;
    static turnClock: TurnClock = new TurnClock();

    public init(app: Application) {
        this.app = app;

        Game.loadAssets();

        loader.load(Game.setup.bind(this));
        SceneManager.init(this.app);
    }

    private static setup(): void {
        SceneManager.addScene(new DebugScene('debug'));
        SceneManager.addScene(new TickerTestScene('ticker_test'));
        SceneManager.addScene(new LevelTestScene('level_test'));
        SceneManager.addScene(new MapGenScene('mapgen'));
        SceneManager.addScene(new SceneSelectScene('scene_select'));

        SceneManager.goToScene('mapgen');
    }

    private static loadAssets() {
        loader.add('button', 'assets/ui/button.json');
        loader.add('map_tiles', '/assets/map/map_tiles.json');
        loader.add('player', '/assets/player.png');
    }
}
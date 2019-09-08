import Container = PIXI.Container;
import Ticker = PIXI.ticker.Ticker;
import DisplayObject = PIXI.DisplayObject;
import {Key} from '../keyboard.event';
import {SceneManager} from '@app/game/scene/scene-manager';

export abstract class Scene {

    private _keys: Key[] = [];
    private globalKeys: Key[] = [];

    protected constructor(
        public readonly id: string,
        public readonly container: Container,
        public readonly ticker: Ticker
    ) {
        const debugKey = Key.create('Backquote');
        debugKey.press = () => {
            if (SceneManager.currentScene.id === 'debug') {
                SceneManager.goToScene(SceneManager.previousScene.id);
            } else {
                SceneManager.goToScene('debug');
            }
        };

        this.globalKeys.push(debugKey);

        const sceneSelectKey = Key.create('Escape');
        sceneSelectKey.press = () => {
            SceneManager.goToScene('scene_select');
        };
        this.globalKeys.push(sceneSelectKey);
    }

    protected set keys(keys: Key[]) {
        console.debug('Scene:set keys - Setting keybindings', keys);
        this._keys = keys;
    }

    public bindKeys(): void {
        console.debug('Scene::bindKeys binding scene-specific keys', this._keys);
        this._keys.forEach(e => e.subscribe());

        console.debug('Scene::bindKeys binding global keys');
        this.globalKeys.forEach(e => e.subscribe());
    }

    public unbindKeys(): void {
        console.debug('Scene::unbindKeys - unbinding keys', this._keys);
        this._keys.forEach(e => e.unsubscribe());
        this.globalKeys.forEach(e => e.unsubscribe());
    }

    public addChild(...children: DisplayObject[]): Scene {
        this.container.addChild(...children);
        return this;
    }
}
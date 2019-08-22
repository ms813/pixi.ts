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
        const debugKey = Key.create('`');
        debugKey.press = () => {
            if (SceneManager.currentScene.id === 'debug') {
                SceneManager.goToScene(SceneManager.lastScene.id);
            } else {
                SceneManager.goToScene('debug');
            }
        };

        this.globalKeys.push(debugKey);

    }

    protected set keys(keys: Key[]) {
        console.log('setting keybindings', keys);
        this._keys = keys;
    }

    public bindKeys(): void {
        console.log('binding scene-specific keys', this._keys);
        this._keys.forEach(e => e.subscribe());
        this.globalKeys.forEach(e => e.subscribe());
    }

    public unbindKeys(): void {
        console.log('unbinding keys', this._keys);
        this._keys.forEach(e => e.unsubscribe());
        this.globalKeys.forEach(e => e.unsubscribe());
    }

    public addChild(...children: DisplayObject[]): Scene {
        this.container.addChild(...children);
        return this;
    }
}
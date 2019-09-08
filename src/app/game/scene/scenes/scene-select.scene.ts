import {Scene} from '@app/game/scene/scene';
import {SceneManager} from '@app/game/scene/scene-manager';
import {Button} from '@app/game/ui/button';
import Container = PIXI.Container;
import Ticker = PIXI.ticker.Ticker;

export class SceneSelectScene extends Scene {
    constructor(id: string) {
        super(id, new Container(), new Ticker());

        const buttons: Button[] = SceneManager.getAllSceneIds().map((id: string, i: number) =>
            new Button(
                id, 100, i * 120,
                () => SceneManager.goToScene(id)
            )
        );

        this.container.addChild(...buttons);
    }

}
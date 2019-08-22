import Application = PIXI.Application;
import {Scene} from '@app/game/scene/scene';

export class SceneManager {

    public static currentScene: Scene;
    public static lastScene: Scene;

    private static scenes: { [key: string]: Scene } = {};
    private static app: Application;

    public static init(app: Application) {
        this.app = app;
    }

    public static addScene(scene: Scene): Scene {
        const id: string = scene.id;
        if (SceneManager.scenes[id]) {
            console.warn(`Scene with ID: ${id} already exists!`);
        } else {
            SceneManager.scenes[id] = scene;
        }

        if (!SceneManager.currentScene) {
            SceneManager.currentScene = scene;
        }

        if (!SceneManager.lastScene) {
            SceneManager.lastScene = scene;
        }

        return SceneManager.scenes[id];
    }

    public static goToScene(id: string): Scene {
        console.log(`SceneManager:: Changing Scene ${id}`);

        const requestedScene = SceneManager.scenes[id];
        if (!requestedScene) {
            throw new ReferenceError(`Cannot go to scene ${id} because it does not exist!`);
        }


        SceneManager.app.ticker.stop();
        SceneManager.app.ticker = requestedScene.ticker;
        SceneManager.app.ticker.start();

        if (SceneManager.currentScene) {
            console.log(`pausing scene: ${id}`);
            this.app.stage.removeChild(SceneManager.currentScene.container);
            SceneManager.currentScene.unbindKeys();
        }

        this.app.stage.addChild(requestedScene.container);
        requestedScene.bindKeys();

        SceneManager.lastScene = SceneManager.currentScene;
        SceneManager.currentScene = requestedScene;
        console.log(`Scene swapped successfully. Current scene: ${SceneManager.currentScene.id}. Last scene: ${SceneManager.lastScene.id}`);

        return requestedScene;
    }
}
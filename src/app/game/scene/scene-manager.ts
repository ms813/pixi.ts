import Application = PIXI.Application;
import {Scene} from '@app/game/scene/scene';

export class SceneManager {

    public static currentScene: Scene;
    public static previousScene: Scene;

    private static scenes: { [key: string]: Scene } = {};
    private static app: Application;

    public static init(app: Application) {
        this.app = app;
    }

    public static addScene(scene: Scene, options?: {overwrite: boolean}): Scene {
        const id: string = scene.id;
        if (SceneManager.scenes[id] && !options.overwrite) {
            console.warn(`Scene with ID: ${id} already exists!`);
        } else {
            SceneManager.scenes[id] = scene;
        }

        if (!SceneManager.currentScene) {
            SceneManager.currentScene = scene;
        }

        if (!SceneManager.previousScene) {
            SceneManager.previousScene = scene;
        }

        return SceneManager.scenes[id];
    }

    public static goToScene(id: string): Scene {
        console.debug(`SceneManager:: Start changing Scene ${id}`);

        const requestedScene = SceneManager.scenes[id];
        if (!requestedScene) {
            throw new ReferenceError(`Cannot go to scene ${id} because it does not exist!`);
        }


        SceneManager.app.ticker.stop();
        SceneManager.app.ticker = requestedScene.ticker;
        SceneManager.app.ticker.start();

        if (SceneManager.currentScene) {
            console.log(`SceneManager:: pausing scene: ${id}`);
            this.app.stage.removeChild(SceneManager.currentScene.container);
            SceneManager.currentScene.unbindKeys();
        }

        this.app.stage.addChild(requestedScene.container);
        requestedScene.bindKeys();

        SceneManager.previousScene = SceneManager.currentScene;
        SceneManager.currentScene = requestedScene;
        console.log(`Scene swapped successfully. Current scene: ${SceneManager.currentScene.id}. Previous scene: ${SceneManager.previousScene.id}`);

        return requestedScene;
    }

    public static hasScene(id: string): boolean {
        return !!SceneManager.scenes[id];
    }

    public static goToPreviousScene() {
        SceneManager.goToScene(SceneManager.previousScene.id);
        console.debug('SceneManager::goToPreviousScene - Swapped current scene and previous scene');
    }
}
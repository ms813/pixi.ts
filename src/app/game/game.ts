import {Application, loader} from 'pixi.js';
import {Character} from '@app/character.class';
import {DeckScene} from '@app/game/deck/deck.scene';
import {Deck} from '@app/game/deck/deck.model';
import {SceneManager} from '@app/game/scene/scene-manager';
import {Menu} from '@app/game/scene/scenes/menu.scene';
import {DebugScene} from '@app/game/scene/scenes/debug.scene';
import {MapTestScene} from '@app/game/scene/scenes/map-test.scene';
import {Scene} from '@app/game/scene/scene';
import Container = PIXI.Container;

export class Game {

    constructor(private app: Application) {
        this.loadAssets();

        loader.load(this.setup.bind(this));
        SceneManager.init(this.app);
    }

    setup(): void {
        SceneManager.addScene(new DebugScene('debug'));
        SceneManager.addScene(new Menu('menu'));
        SceneManager.addScene(new MapTestScene('map_test'));

        SceneManager.goToScene('map_test');
    }

    private buildDeckScene(): Scene {
        const cards = [
            {name: 'A'},
            {name: 'B'},
            {name: 'C'},
            {name: 'D'}
        ];

        const deck = new Deck(cards);
        const deckScene = SceneManager.addScene(new DeckScene('test-deck-scene', deck));
        // append hero
        const hero = new Character(loader.resources['samir'].texture);
        const heroSprite = hero.sprite;

        const testAnimation = new Container();
        testAnimation.addChild(heroSprite);
        heroSprite.y = 300;

        //  animate hero
        let moveLeft = true;
        deckScene.ticker.add(() => {
            const speed = 2;
            if (heroSprite.x < this.app.view.width && moveLeft) {
                heroSprite.x += speed;
            } else {
                heroSprite.x -= speed;
                moveLeft = heroSprite.x <= 0;
            }
        });
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

    private loadAssets() {
        loader.add('samir', '/assets/img/hero.png');
        loader.add('button', 'assets/ui/button.json');
        loader.add('map_tiles', '/assets/map/map_tiles.json');
    }
}
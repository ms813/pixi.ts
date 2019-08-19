import {Application, loader} from 'pixi.js';
import {Character} from '@app/character.class';
import {DeckScene} from '@app/game/deck/deck.scene';
import {Deck} from '@app/game/deck/deck.model';
import {SceneManager} from '@app/game/scene-manager';
import {Menu} from '@app/game/menu.scene';
import {DebugScene} from '@app/game/debug.scene';
import Container = PIXI.Container;

export class Game {

    constructor(private app: Application) {
        // preload needed assets
        loader.add('samir', '/assets/img/hero.png');

        // then launch app
        loader.load(this.setup.bind(this));
        SceneManager.init(this.app);
    }

    setup(): void {
        const cards = [
            {name: 'A'},
            {name: 'B'},
            {name: 'C'},
            {name: 'D'}
        ];

        const deck = new Deck(cards);

        const entryScene = SceneManager.addScene(new DeckScene('test-deck-view', deck));
        SceneManager.addScene(new DebugScene('debug'));
        SceneManager.addScene(new Menu('menu'));

        // append hero
        const hero = new Character(loader.resources['samir'].texture);
        const heroSprite = hero.sprite;

        const testAnimation = new Container();
        testAnimation.addChild(heroSprite);
        heroSprite.y = 300;

        //  animate hero
        let moveLeft = true;
        entryScene.ticker.add(() => {
            const speed = 2;
            if (heroSprite.x < this.app.view.width && moveLeft) {
                heroSprite.x += speed;
            } else {
                heroSprite.x -= speed;
                moveLeft = heroSprite.x <= 0;
            }
        });
        entryScene.container.addChild(testAnimation);
        SceneManager.goToScene('test-deck-view');
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
}
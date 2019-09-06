import {Scene} from '@app/game/scene/scene';
import {LevelMap} from '@app/game/map/level-map';
import {LevelMapGenerator} from '@app/game/map/level-map.generator';
import {Key} from '@app/game/keyboard.event';
import {Player} from '@app/game/actor/player';
import {Deck} from '@app/game/deck/deck';
import {Direction} from '@app/game/direction.enum';
import {HandView} from '@app/game/deck/hand.view';
import {Enemy} from '@app/game/actor/enemy';
import {Game} from '@app/game/game';
import {CardDictionary} from '@app/game/card/dictionary/card-dictionary';
import Ticker = PIXI.ticker.Ticker;
import Container = PIXI.Container;

export class LevelTestScene extends Scene {

    private readonly map: LevelMap;
    private readonly player: Player;

    constructor(id: string) {
        super(id, new Container(), new Ticker());

        this.map = new LevelMapGenerator(32, 17)
        .grid(0xcccccc)
        // .randomWalls(0.3)
        .build();

        console.debug('map:', this.map);

        this.addChild(this.map);
        const {enemies, player} = this.map;
        const cards = [];
        for (let i = 0; i < 10; i++) {
            const card = CardDictionary.get('revolver');
            card.view.map = this.map;
            cards.push(card);
        }

        this.player = new Player(new Deck(cards));
        this.player.x = 1;
        this.player.y = 1;
        this.addChild(this.player.sprite);
        this.map.player = this.player;

        const handView: HandView = new HandView(this.player);
        this.addChild(handView);
        this.player.onDraw = [handView.draw];
        this.player.onDiscard = [handView.discard];
        this.player.onMove = [this.map.update];

        enemies.push(new Enemy('test-enemy', this.map));
        enemies.forEach((e: Enemy) => {
            Game.turnClock.scheduleTurn(e, 2);
            e.x = 5;
            e.y = 5;
            // e.x = this.map.width - 2;
            // e.y = this.map.height - 2;
            this.addChild(e.sprite);
        });

        // // draw some cards to test the deck
        // const drawTimeoutMillis: number = 1000;
        // let millisLeftUntilDraw: number = drawTimeoutMillis;
        // this.ticker.add((delta: number) => {
        //     if (millisLeftUntilDraw <= 0) {
        //         const {drawPile, hand, discardPile} = player;
        //         console.debug(`Before draw - draw: ${drawPile.length}, hand: ${hand.length}, discard: ${discardPile.length}`);
        //         player.draw();
        //         millisLeftUntilDraw = drawTimeoutMillis;
        //     }
        //     millisLeftUntilDraw -= this.ticker.elapsedMS;
        // });

        // put some cards in the players hand to start
        while (this.player.hand.length < 3) {
            this.player.draw();
        }

        this.keys = this.getKeybindings();
    }

    private getKeybindings(): Key[] {
        const {N, NE, E, SE, S, SW, W, NW} = Direction;
        const {player} = this.map;
        return [
            Key.create('ArrowUp', () =>
                player.move(N, this.map.isLegalMove(player.x, player.y, N))
            ),
            Key.create('Numpad8', () =>
                player.move(N, this.map.isLegalMove(player.x, player.y, N))
            ),
            Key.create('Numpad9', () =>
                player.move(NE, this.map.isLegalMove(player.x, player.y, NE))
            ),
            Key.create('ArrowRight', () =>
                player.move(E, this.map.isLegalMove(player.x, player.y, E))
            ),
            Key.create('Numpad6', () =>
                player.move(E, this.map.isLegalMove(player.x, player.y, E))
            ),
            Key.create('Numpad3', () =>
                player.move(SE, this.map.isLegalMove(player.x, player.y, SE))
            ),
            Key.create('ArrowDown', () =>
                player.move(S, this.map.isLegalMove(player.x, player.y, S))
            ),
            Key.create('Numpad2', () =>
                player.move(S, this.map.isLegalMove(player.x, player.y, S))),
            Key.create('Numpad1', () =>
                player.move(SW, this.map.isLegalMove(player.x, player.y, SW))
            ),
            Key.create('ArrowLeft', () =>
                player.move(W, this.map.isLegalMove(player.x, player.y, W))
            ),
            Key.create('Numpad4', () =>
                player.move(W, this.map.isLegalMove(player.x, player.y, W))
            ),
            Key.create('Numpad7', () =>
                player.move(NW, this.map.isLegalMove(player.x, player.y, NW))
            ),
            Key.create('Numpad5', () => player.doTurn(player.moveSpeed))
        ];
    }
}
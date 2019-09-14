import {LevelMap} from '@app/game/map/level-map';
import {SimpleMapGenerator} from '@app/game/map/generator/simple-map.generator';
import {Key} from '@app/game/keyboard.event';
import {Player} from '@app/game/actor/player';
import {Deck} from '@app/game/deck/deck';
import {Direction} from '@app/game/direction.enum';
import {HandView} from '@app/game/deck/hand.view';
import {Enemy} from '@app/game/actor/enemy';
import {Game} from '@app/game/game';
import {CardDictionary} from '@app/game/card/dictionary/card-dictionary';
import {Utils} from '@app/utils';
import {Scene} from '@app/game/scene/scene';
import {TileType} from '@app/game/map/tile';
import {Container, ticker} from 'pixi.js';
import Ticker = ticker.Ticker;

export class LevelTestScene extends Scene {

    private readonly map: LevelMap;
    private readonly player: Player;

    constructor(id: string) {
        super(id, new Container(), new Ticker());

        this.map = new SimpleMapGenerator(50, 50)
        .grid(0xcccccc)
        .randomWalls(0.3)
        .discovered(true)
        .build();

        console.debug('map:', this.map);

        this.addChild(this.map);

        const cards = [];
        for (let i = 0; i < 10; i++) {
            const s = i % 2 == 0 ? 'revolver' : 'firstAid';
            const card = CardDictionary.get(s);
            card.view.map = this.map;
            cards.push(card);
        }

        this.player = new Player(new Deck(cards));
        do {
            this.player.x = Utils.randomInt(1, this.map.width - 2);
            this.player.y = Utils.randomInt(1, this.map.height - 2);
        } while (this.map.tiles[this.map.coordsToIndex(this.player.x, this.player.y)].type !== TileType.FLOOR);


        this.map.player = this.player;

        const handView: HandView = new HandView(this.player);
        this.addChild(handView);
        this.player.onDraw = [handView.draw];
        this.player.onDiscard = [handView.discard];
        this.player.onMove = [this.map.update];

        for (let i = 0; i < 10; i++) {
            const e = new Enemy(`test-target-${i}`, this.map);
            Game.turnClock.scheduleTurn(e, 2);

            let x, y, tile;
            do {
                x = Utils.randomInt(1, this.map.width - 2);
                y = Utils.randomInt(1, this.map.height - 2);
                tile = this.map.getTileFromMapCoords(x, y);
            } while (!tile.passable);

            e.x = x;
            e.y = y;
            e.onMove = [this.map.update];
            e.onDeath = [this.map.removeEnemy];
        }

        const x = setInterval(() => {
            // put some cards in the players hand to start
            this.player.draw();
            if (this.player.hand.length >= 3) clearInterval(x);
        }, 500);

        this.keys = this.getKeybindings();
        this.map.update();
    }


    private getKeybindings(): Key[] {
        const {N, NE, E, SE, S, SW, W, NW} = Direction;
        const {player} = this.map;
        return [
            // move map
            Key.create('ArrowUp', () => this.map.scroll(S)),
            Key.create('ArrowDown', () => this.map.scroll(N)),
            Key.create('ArrowLeft', () => this.map.scroll(E)),
            Key.create('ArrowRight', () => this.map.scroll(W)),

            // move player
            Key.create('Numpad8', () =>
                player.move(N, this.map.isLegalMove(player.x, player.y, N))
            ),
            Key.create('Numpad9', () =>
                player.move(NE, this.map.isLegalMove(player.x, player.y, NE))
            ),
            Key.create('Numpad6', () =>
                player.move(E, this.map.isLegalMove(player.x, player.y, E))
            ),
            Key.create('Numpad3', () =>
                player.move(SE, this.map.isLegalMove(player.x, player.y, SE))
            ),
            Key.create('Numpad2', () =>
                player.move(S, this.map.isLegalMove(player.x, player.y, S))),
            Key.create('Numpad1', () =>
                player.move(SW, this.map.isLegalMove(player.x, player.y, SW))
            ),
            Key.create('Numpad4', () =>
                player.move(W, this.map.isLegalMove(player.x, player.y, W))
            ),
            Key.create('Numpad7', () =>
                player.move(NW, this.map.isLegalMove(player.x, player.y, NW))
            ),
            Key.create('Numpad5', () => player.doTurn(player.moveSpeed)),
            Key.create('Enter', () => this.map.centerOn(this.player.x, this.player.y))
        ];
    }
}
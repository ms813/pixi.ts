import {Scene} from '@app/game/scene/scene';
import {LevelMap} from '@app/game/map/level-map';
import {LevelMapGenerator} from '@app/game/map/level-map.generator';
import {Key} from '@app/game/keyboard.event';
import {Player} from '@app/game/actor/player';
import {Card} from '@app/game/card/card';
import {Deck} from '@app/game/deck/deck';
import {Direction} from '@app/game/direction.enum';
import {HandView} from '@app/game/deck/hand.view';
import Ticker = PIXI.ticker.Ticker;
import Container = PIXI.Container;

export class MapTestScene extends Scene {
    private player: Player;
    private map: LevelMap;

    constructor(id: string) {
        super(id, new Container(), new Ticker());

        this.map = new LevelMapGenerator(10, 10)
        .grid(0xcccccc)
        .randomWalls(0.3)
        .build();

        console.debug('map:', this.map);

        this.addChild(this.map);

        const cards = [];
        for (let i = 0; i < 10; i++) {
            cards.push(new Card(`test-card-${i}`));
        }

        this.player = new Player(new Deck(cards));
        this.player.x = 1;
        this.player.y = 1;
        this.addChild(this.player.sprite);

        const handView: HandView = new HandView(this.player);
        this.addChild(handView);
        this.player.onDraw = [handView.draw];
        this.player.onDiscard = [handView.discard];


        // const drawTimer = setInterval(() => {
        //     const {drawPile, hand, discardPile} = this.player;
        //     console.log(`Before draw - draw: ${drawPile.length}, hand: ${hand.length}, discard: ${discardPile.length}`);
        //     this.player.draw();
        // }, 200);
        // const draw = () => {
        //     const {drawPile, hand, discardPile} = this.player;
        //     console.log(`Before draw - draw: ${drawPile.length}, hand: ${hand.length}, discard: ${discardPile.length}`);
        //     this.player.draw();
        //
        //     // keep drawing until no cards left in draw pile
        //     if (this.player.drawPile.length > 0) {
        //         console.log('clearing draw interval');
        //         setTimeout(draw, 1000);
        //     }
        // };
        //
        // setTimeout(draw, 1000);

        this.keys = this.getKeybindings();
    }

    private getKeybindings(): Key[] {
        const {N, NE, E, SE, S, SW, W, NW} = Direction;

        return [
            Key.create('ArrowUp', () =>
                this.player.move(N, this.map.isLegalMove(this.player.x, this.player.y, N))
            ),
            Key.create('Numpad8', () =>
                this.player.move(N, this.map.isLegalMove(this.player.x, this.player.y, N))
            ),
            Key.create('Numpad9', () =>
                this.player.move(NE, this.map.isLegalMove(this.player.x, this.player.y, NE))
            ),
            Key.create('ArrowRight', () =>
                this.player.move(E, this.map.isLegalMove(this.player.x, this.player.y, E))
            ),
            Key.create('Numpad6', () =>
                this.player.move(E, this.map.isLegalMove(this.player.x, this.player.y, E))
            ),
            Key.create('Numpad3', () =>
                this.player.move(SE, this.map.isLegalMove(this.player.x, this.player.y, SE))
            ),
            Key.create('ArrowDown', () =>
                this.player.move(S, this.map.isLegalMove(this.player.x, this.player.y, S))
            ),
            Key.create('Numpad2', () =>
                this.player.move(S, this.map.isLegalMove(this.player.x, this.player.y, S))),
            Key.create('Numpad1', () =>
                this.player.move(SW, this.map.isLegalMove(this.player.x, this.player.y, SW))
            ),
            Key.create('ArrowLeft', () =>
                this.player.move(W, this.map.isLegalMove(this.player.x, this.player.y, W))
            ),
            Key.create('Numpad4', () =>
                this.player.move(W, this.map.isLegalMove(this.player.x, this.player.y, W))
            ),
            Key.create('Numpad7', () =>
                this.player.move(NW, this.map.isLegalMove(this.player.x, this.player.y, NW))
            )
        ];
    }
}
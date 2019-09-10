import Container = PIXI.Container;
import Text = PIXI.Text;
import TextStyleOptions = PIXI.TextStyleOptions;
import Graphics = PIXI.Graphics;
import Rectangle = PIXI.Rectangle;
import InteractionData = PIXI.interaction.InteractionData;
import InteractionEvent = PIXI.interaction.InteractionEvent;
import {LevelMap} from '@app/game/map';
import {Card} from '@app/game/card/card';
import {DragEndData} from '@app/game/card/drag-end.data';
import {Tile} from '@app/game/map/tile';
import {Movable} from '@app/game/actor';
import {TargetingType} from '@app/game/card/targeting-type';


export class CardView extends Container {

    private nameText: Text;
    public static readonly width: number = 96;
    public static readonly height: number = 128;

    // drag and drop
    private dragData: InteractionData;
    private dragging: boolean = false;
    private dragStart: { x: number, y: number };

    private _map: LevelMap;

    private readonly textStyleOptions: TextStyleOptions = {
        fontFamily: 'Arial',
        fontSize: 14,
        fill: 0x000000
    };

    constructor(private card: Card, x: number = 0, y: number = 0) {
        super();
        this.x = x;
        this.y = y;
        this.hideRange = this.hideRange.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragMove = this.onDragMove.bind(this);

        const border: Graphics = new Graphics();
        console.debug(`CardView::new - ${card.name}: (${x}, ${y})`);
        border.lineStyle(1, 0x000000);
        border.drawRect(0, 0, CardView.width, CardView.height);
        border.interactive = true;
        border.hitArea = new Rectangle(0, 0, CardView.width, CardView.height);
        border.on('mouseover', (e: InteractionData) => this.showRange(this.card.range));
        border.on('mouseout', () => this.hideRange());
        this.card.onDiscard.unshift(() => this.hideRange());

        this.initDrag(border);
        this.nameText = new Text(card.displayName, this.textStyleOptions);

        this.addChild(border);
        this.addChild(this.nameText);
    }

    public showRange(range: number): void {
        const {player: {x, y}} = this.map;
        this.map.showRange(x, y, range);
    };

    public hideRange() {
        this.map.hideRange();
    }

    public isWithinRange(x: number, y: number): boolean {
        const {player} = this.map;
        return x <= player.x + this.card.range
            && x >= player.x - this.card.range
            && y <= player.y + this.card.range
            && y >= player.y - this.card.range;
    }

    public getDragEndData(pX: number, pY: number): DragEndData {
        const {x, y} = this.map.pixelCoordsToMapCoords(pX, pY);
        const tile: Tile = this.map.getTileFromPixelCoords(pX, pY);

        let target: Movable;
        if (this.card.targeting === TargetingType.SELF) {
            target = this.map.player;
        } else {
            target = this.map.getMovableAt(x, y);
        }

        return {
            pX, pY,
            x, y,
            tile, target,
            card: this.card,
            player: this.map.player
        };
    }

    private initDrag(g: Graphics) {
        g.on('mousedown', this.onDragStart)
        .on('mouseup', this.onDragEnd)
        .on('mouseupoutside', this.onDragEnd)
        .on('mousemove', this.onDragMove);
    }

    private onDragStart(e: InteractionEvent) {
        this.dragData = e.data;

        this.alpha = 0.5;
        this.dragging = true;
        this.dragStart = {x: this.x, y: this.y};
    }

    private onDragEnd(e: InteractionEvent) {
        this.alpha = 1;
        this.dragging = false;
        this.dragData = null;
        const {x, y} = e.data.getLocalPosition(this.map);

        // make sure drag end is within the map bounds
        let dragEndData;
        try {
            dragEndData = this.getDragEndData(x, y);
        } catch (e) {
            // drag end was not within map bounds
            this.x = this.dragStart.x;
            this.y = this.dragStart.y;
        }

        if (dragEndData && this.isValidPlay(dragEndData)) {
            this.play(dragEndData);
            this.discard(dragEndData);
        } else {
            this.x = this.dragStart.x;
            this.y = this.dragStart.y;
        }
    }

    private onDragMove(e: InteractionEvent) {
        if (this.dragging) {
            let newPosition = this.dragData.getLocalPosition(this.parent);
            this.x = newPosition.x - CardView.width / 2;
            this.y = newPosition.y - CardView.height / 2;
        }
    }

    private isValidPlay(dragEndData: DragEndData): boolean {
        const {x, y, target} = dragEndData;

        // play self targeted cards as soon as they are dropped anywhere on the map
        if (this.card.targeting === TargetingType.SELF) {
            return true;
        }

        if (!this.isWithinRange(x, y)) {
            return false;
        }

        switch (this.card.targeting) {
            case (TargetingType.UNIT):
                // unit targeted cards can only be played on an in-range square containing and target
                return !!target;

            case (TargetingType.POINT):
                // point targeted cards can be played on any in-range square
                return true;
        }
    }

    private play(dragEndData: DragEndData): void {
        this.map.playCard(dragEndData);
    }

    private discard(dragEndData: DragEndData): void {
        this.card.onDiscard.forEach(fn => fn());
    }

    get map(): LevelMap {
        return this._map;
    }

    set map(value: LevelMap) {
        this._map = value;
    }
}

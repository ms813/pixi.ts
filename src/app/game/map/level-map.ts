import {Utils} from '@app/utils';
import {Shadow, ShadowLine} from '@app/game/map/shadow';
import {Tile, TileType} from '@app/game/map/tile';
import {Enemy, Movable, Player} from '@app/game/actor';
import {DragEndData} from '@app/game/card';
import {Game, TILE_SIZE} from '@app/game/game';
import {Direction} from '@app/game/direction.enum';
import {Container, interaction, loader, loaders, Point, Rectangle, Sprite} from 'pixi.js';
import InteractionData = interaction.InteractionData;
import InteractionEvent = interaction.InteractionEvent;
import Resource = loaders.Resource;

export class LevelMap extends Container {
    private _isGridVisible: boolean = true;
    private _tiles: Tile[] = [];
    private _width: number;
    private _height: number;
    private pixelWidth: number;
    private pixelHeight: number;
    private _grid: Container;
    private _enemies: Enemy[] = [];
    private _player: Player;
    private rangeIndicator: Container;
    private resources: Resource;

    private dragging: boolean = false;
    private dragStart: Point;
    private dragData: InteractionData;

    private _fog: boolean = true;

    constructor(width: number, height: number) {
        super();
        this._width = width;
        this._height = height;
        this.pixelWidth = width * TILE_SIZE;
        this.pixelHeight = height * TILE_SIZE;
        this.resources = loader.resources['map_tiles'];
        this.update = this.update.bind(this);
        this.removeEnemy = this.removeEnemy.bind(this);
        this.rangeIndicator = new Container();

        this.interactive = true;
        this.buttonMode = true;
        this.hitArea = new Rectangle(0, 0, this.pixelWidth, this.pixelHeight);

        this.on('mousedown', this.onDragStart)
        .on('mouseup', this.onDragEnd)
        .on('mouseupoutside', this.onDragEnd)
        .on('mousemove', this.onDragMove);
    }

    public get height(): number {
        return this._height;
    }

    public set height(height: number) {
        this._height = height;
    }

    public get width(): number {
        return this._width;
    }

    get isGridVisible(): boolean {
        return this._isGridVisible;
    }

    set isGridVisible(value: boolean) {
        value ? this.addChild(this.grid) : this.removeChild(this.grid);
        this._isGridVisible = value;
    }

    get tiles(): Tile[] {
        return this._tiles;
    }

    set tiles(tiles: Tile[]) {
        this.addChild(...tiles);
        this._tiles = tiles;
    }

    get grid(): Container {
        return this._grid;
    }

    set grid(grid: Container) {
        this._grid = grid;
    }

    public isPassable(x: number, y: number): boolean {
        return this.tiles[this.coordsToIndex(x, y)].passable;
    }

    public update() {
        this.tiles.forEach(t => t.passable = t.type === TileType.FLOOR);

        if (this.player) {
            const {x, y} = this.player;
            this.tiles[this.coordsToIndex(x, y)].passable = false;
            this.rangeIndicator.x = x * TILE_SIZE;
            this.rangeIndicator.y = y * TILE_SIZE;
            this.centerOn(x, y);
            if (this.fog) {
                for (let i = 0; i < 8; i++) {
                    this.refreshOctant(x, y, i);
                }
            }
        }

        this._enemies.forEach(e => {
            const {x, y} = e;
            const tile = this.tiles[this.coordsToIndex(x, y)];
            tile.passable = false;

            this.setActorVisibility(e, tile);
        });
    }

    setActorVisibility(actor: Movable, tile: Tile): boolean {
        const {x: ax, y: ay} = actor;
        const {x: px, y: py} = this.player;
        const isWithinDetectionRange = Utils.isWithinSquare(ax, ay, px, py, this.player.detectionRadius);

        if (isWithinDetectionRange) {
            actor.visible = true;
            return true;
        }

        if (tile.isVisible && !actor.visible) {
            actor.visible = true;
            return true;
        } else if (!tile.isVisible && actor.visible) {
            actor.visible = false;
            return false;
        }
    }

    public coordsToIndex(x: number, y: number): number {
        if (x < 0 || x >= this.width) {
            throw RangeError(`LevelMap::coordsToIndex - x out of bounds (x = ${x}, width = ${this.width}`);
        }

        if (y < 0 || y >= this.height) {
            throw RangeError(`LevelMap::coordsToIndex - y out of bounds (y = ${y}, height = ${this.height}`);
        }

        return y * this.width + x;
    }

    public indexToCoords(i: number): { x: number, y: number } {
        if (i < 0 || i >= this.tiles.length) {
            throw RangeError(`LevelMap::indexToCoords index out of bounds, i = ${i}, expected a value in the range (0, ${this.tiles.length})`);
        }

        return {
            x: i % this.width,
            y: Math.floor(i / this.width)
        };
    }

    public isInBounds(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    isLegalMove(x: number, y: number, direction: Direction): boolean {
        const canMove = {
            up: y > 0,
            right: x < this.width - 1,
            down: y < this.height - 1,
            left: x > 0
        };

        const isMoveLegal = {
            [Direction.N]: () => canMove.up && this.isPassable(x, y - 1),
            [Direction.NE]: () => canMove.up && canMove.right && this.isPassable(x + 1, y - 1),
            [Direction.E]: () => canMove.right && this.isPassable(x + 1, y),
            [Direction.SE]: () => canMove.right && canMove.down && this.isPassable(x + 1, y + 1),
            [Direction.S]: () => canMove.down && this.isPassable(x, y + 1),
            [Direction.SW]: () => canMove.down && canMove.left && this.isPassable(x - 1, y + 1),
            [Direction.W]: () => canMove.left && this.isPassable(x - 1, y),
            [Direction.NW]: () => canMove.left && canMove.up && this.isPassable(x - 1, y - 1)
        };

        console.debug(`isLegal: (${x}, ${y}), ${Direction[direction]}, ${isMoveLegal[direction]()}`);
        return isMoveLegal[direction]();
    }

    public showRange = (x: number, y: number, range: number): void => {
        //highlight circle centered at (x, y) with radius = range
        console.debug(`LevelMap::showRange - Center=(${x}, ${y}), r=${range}`);

        for (let i = -range; i <= range; i++) {
            for (let j = -range; j <= range; j++) {
                const s: Sprite = new Sprite(this.resources.textures['test_tiles_2.png']);
                s.x = i * TILE_SIZE;
                s.y = j * TILE_SIZE;
                this.rangeIndicator.addChild(s);
                s.alpha = 0.3;
            }
        }
        this.addChild(this.rangeIndicator);
    };

    public hideRange() {
        this.rangeIndicator.removeChildren(0, this.rangeIndicator.children.length);
    }

    public getTileFromMapCoords(x: number, y: number): Tile {
        return this.tiles[this.coordsToIndex(x, y)];
    }

    public getTileFromPixelCoords(pX: number, pY: number): Tile {
        return this.tiles[this.pixelCoordsToIndex(pX, pY)];
    }

    public pixelCoordsToMapCoords(pX: number, pY: number): { x: number, y: number } {
        return {
            x: Math.floor(pX / TILE_SIZE),
            y: Math.floor(pY / TILE_SIZE)
        };
    }

    public pixelCoordsToIndex(pX: number, pY: number): number {
        const {x, y} = this.pixelCoordsToMapCoords(pX, pY);
        return this.coordsToIndex(x, y);
    }

    public playCard(dragEndData: DragEndData): void {
        const {card} = dragEndData;
        card.onPlay.forEach(fn => fn(dragEndData));
        this.player.doTurn(card.speed);
    }

    public discardCard(dragEndData: DragEndData): void {

    }

    public getMovableAt(x: number, y: number): Movable {
        if (this.player.x === x && this.player.y === y) {
            return this.player;
        }
        return this.enemies.find((e: Enemy) => e.x === x && e.y === y);
    }

    public scroll(direction: Direction): LevelMap {
        const moveFnMap: { [key: string]: (c: Container) => void } = {
            [Direction.N]: (c: Container) => c.y -= TILE_SIZE,
            [Direction.NE]: (c: Container) => {
                c.x += TILE_SIZE;
                c.y -= TILE_SIZE;
            },
            [Direction.E]: (c: Container) => c.x += TILE_SIZE,
            [Direction.SE]: (c: Container) => {
                c.x += TILE_SIZE;
                c.y += TILE_SIZE;
            },
            [Direction.S]: (c: Container) => c.y += TILE_SIZE,
            [Direction.SW]: (c: Container) => {
                c.x -= TILE_SIZE;
                c.y += TILE_SIZE;
            },
            [Direction.W]: (c: Container) => c.x -= TILE_SIZE,
            [Direction.NW]: (c: Container) => {
                c.x -= TILE_SIZE;
                c.y -= TILE_SIZE;
            }
        };
        moveFnMap[direction](this);
        return this;
    }

    private screenCenter = (): Point => new Point(window.innerWidth / 2, window.innerHeight / 2);

    private viewportCenter = (): Point => new Point(Game.width / 2, Game.height / 2);

    public centerOn(x: number, y: number): { x: number, y: number } {
        const {x: cx, y: cy} = this.viewportCenter();

        const dx = (cx - x * TILE_SIZE);
        const dy = (cy - y * TILE_SIZE);
        // this.x = dx;
        // this.y = dy;
        // return {x: dx, y: dy};
        return this.snapToDragLimit(dx, dy);
    }

    private onDragStart(e: InteractionEvent) {
        this.dragData = e.data;
        this.dragging = true;
        const {x, y} = e.data.getLocalPosition(this.parent);
        this.dragStart = new Point(x - this.x, y - this.y);
    }

    private onDragEnd() {
        this.dragging = false;
        this.dragData = null;
    }

    private onDragMove(e: InteractionEvent) {
        if (this.dragging) {
            const {x, y} = this.dragData.getLocalPosition(this.parent);

            let dx = x - this.dragStart.x;
            let dy = y - this.dragStart.y;
            this.snapToDragLimit(dx, dy);
        }
    }

    private snapToDragLimit(x: number, y: number): Point {
        const {x: cx, y: cy} = this.viewportCenter();
        if (x > cx / 2) {
            x = cx / 2;
        }

        // prevent map being dragged off the right of the screen
        if (x + this.pixelWidth < cx * (3 / 2)) {
            x = cx * (3 / 2) - this.pixelWidth;
        }

        // prevent map being dragged off the bottom of the screen
        if (y > cy / 2) {
            y = cy / 2;
        }

        // prevent map being dragged off the top of the screen
        if (y + this.pixelHeight < cy * (3 / 2)) {
            y = cy * (3 / 2) - this.pixelHeight;
        }
        this.x = x;
        this.y = y;

        return new Point(x, y);
    }

    public set player(player: Player) {
        this._player = player;
        this.addChild(player.sprite);
        this.update();
    }

    public get player(): Player {
        return this._player;
    }

    public get enemies(): Enemy[] {
        return this._enemies;
    }

    public set enemies(enemies: Enemy[]) {
        this._enemies = enemies;
        this._enemies.forEach(e => this.addChild(e.sprite));
        this.update();
    }

    public addEnemy(enemy: Enemy) {
        this._enemies.push(enemy);
        this.addChild(enemy.sprite);
        this.update();
    }

    public removeEnemy(enemy: Enemy) {
        this._enemies = this._enemies.filter(e => e != enemy);
        this.removeChild(enemy.sprite);
        this.update();
    }

    public refreshOctant(pX: number, pY: number, octant: number) {
        const line = new ShadowLine();
        let fullShadow = false;
        for (let row = 0; ; row++) {
            const {x, y} = Utils.transformOctant(row, 0, octant);
            if (!this.isInBounds(pX + x, pY + y)) break;

            for (let col = 0; col <= row; col++) {
                const {x, y} = Utils.transformOctant(row, col, octant);
                if (!this.isInBounds(pX + x, pY + y)) break;

                const tile = this.tiles[this.coordsToIndex(pX + x, pY + y)];
                if (fullShadow) {
                    tile.isVisible = false;
                } else {
                    let projection: Shadow = this.projectTile(row, col);

                    const {visionRadius} = this.player;
                    let visible: boolean = !line.isInShadow(projection) && row <= visionRadius && col <= visionRadius;
                    tile.isVisible = visible;

                    if (visible && (tile.type === TileType.WALL || tile.type === TileType.INDESTRUCTABLE_WALL)) {
                        line.add(projection);
                        fullShadow = line.isFullShadow;
                    }
                }
            }
        }
    }

    projectTile(row: number, col: number): Shadow {
        const topLeft = col / (row + 2);
        const bottomRight = (col + 1) / (row + 1);
        return new Shadow(topLeft, bottomRight);
    }

    get fog(): boolean {
        return this._fog;
    }

    set fog(value: boolean) {
        this.tiles.forEach(t => t.isVisible = !value);
        this.update();
        this._fog = value;
    }
}

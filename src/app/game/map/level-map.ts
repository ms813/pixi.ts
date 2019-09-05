import {Tile, TileType} from '@app/game/map/tile';
import {Direction} from '@app/game/direction.enum';
import {Player} from '@app/game/actor/player';
import {Enemy} from '@app/game/actor/enemy';
import Container = PIXI.Container;

export class LevelMap extends Container {

    private _isGridVisible: boolean = true;
    private _tiles: Tile[] = [];
    private _width: number;
    private _height: number;
    private _grid: Container;
    private _enemies: Enemy[] = [];
    private _player: Player;

    constructor(width: number, height: number) {
        super();
        this.width = width;
        this.height = height;

        this.update = this.update.bind(this);
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

    public set width(width: number) {
        this._width = width;
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
        }

        this._enemies.forEach(e => {
            const {x, y} = e;
            this.tiles[this.coordsToIndex(x, y)].passable = false;
        });
    }

    public coordsToIndex(x: number, y: number): number {
        if (x < 0 || x >= this.width) {
            throw RangeError(`LevelMap::coordsToIndex - x out of bounds (x = ${x}, width = ${this.width}`);
        }

        if (y < 0 || y >= this.height) {
            throw RangeError(`CoordsToIndex - y out of bounds (y = ${y}, height = ${this.height}`);
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

    public set player(player: Player) {
        this._player = player;
        this.update();
    }

    public get player(): Player {
        return this._player;
    }

    public addEnemy(...enemy: Enemy[]) {
        this._enemies.push(...enemy);
        this.update();
    }

    public removeEnemy(enemy: Enemy) {
        this._enemies = this._enemies.filter(e => e != enemy);
        this.update();
    }
}

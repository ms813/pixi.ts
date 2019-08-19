import {Tile} from '@app/game/map/tile.model';

export class LevelMap {

    private _tiles : Tile[] = [];
    private _width: number;
    private _height: number;

    public get height(): number{
        return this._height;
    }

    public set height(height: number){
        this._height = height;
    }


    public get width(): number {
        return this._width;
    }

    public set width(value: number) {
        this._width = value;
    }


    get tiles(): Tile[] {
        return this._tiles;
    }

    set tiles(value: Tile[]) {
        this._tiles = value;
    }
}
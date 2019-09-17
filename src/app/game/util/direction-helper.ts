import {Point} from 'pixi.js';
import {Utils} from '@app/game/util/utils';

export class DirectionHelper {
    public static readonly NORTH: Point = new Point(0, -1);
    public static readonly NORTH_EAST: Point = new Point(1, -1);
    public static readonly EAST: Point = new Point(1, 0);
    public static readonly SOUTH_EAST: Point = new Point(1, 1);
    public static readonly SOUTH: Point = new Point(0, 1);
    public static readonly SOUTH_WEST: Point = new Point(-1, 1);
    public static readonly WEST: Point = new Point(-1, 0);
    public static readonly NORTH_WEST: Point = new Point(-1, -1);

    public static readonly CARDINAL = [
        DirectionHelper.NORTH,
        DirectionHelper.EAST,
        DirectionHelper.SOUTH,
        DirectionHelper.WEST
    ];

    public static readonly ORDINAL = [
        DirectionHelper.NORTH_EAST,
        DirectionHelper.SOUTH_EAST,
        DirectionHelper.SOUTH_WEST,
        DirectionHelper.NORTH_WEST
    ];

    public static readonly ALL = [
        ...DirectionHelper.CARDINAL,
        ...DirectionHelper.ORDINAL
    ];

    public static random(type?: string) {
        if (type.toLowerCase() === 'cardinal') {
            return DirectionHelper.CARDINAL[Utils.randomInt(0, DirectionHelper.CARDINAL.length - 1)];
        } else if (type.toLowerCase() === 'ordinal') {
            return DirectionHelper.ORDINAL[Utils.randomInt(0, DirectionHelper.ORDINAL.length - 1)];
        } else {
            return DirectionHelper.ALL[Utils.randomInt(0, DirectionHelper.ALL.length - 1)];
        }
    }
}
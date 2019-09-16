import {Direction} from '@app/game/util/direction.enum';

export interface TunnelerParams {
    id: string
    x: number,
    y: number,
    direction: Direction,
    width: {
        initial: number;
        min: number;
        max: number;
        changeProbability: number;
    },
    spawn: {
        tunnelers: {
            probability: number,
            id: string
        }[],
        rooms: {
            probability: number,
            id: string
        }[]
    },
    deathProbability: number
    turnProbability: number;
}
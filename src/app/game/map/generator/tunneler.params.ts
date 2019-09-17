import {Point} from 'pixi.js';

export interface TunnelerParams {
    id: string
    x: number,
    y: number,
    direction: Point,
    width: {
        initial: number;
        min: number;
        max: number;
        changeProbability: number;
    },
    junction: {
        maxPadding: number
        minPadding: number,
        probability: number
    }
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
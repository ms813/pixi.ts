import {Movable} from '@app/game/actor/movable';
import {Player} from '@app/game/actor/player';

export class TurnClock {
    private _currentTurn: number = 0;

    private turnSchedule: { [key: string]: Movable[] } = {};

    constructor() {
        this.cleanSchedule.bind(this);
    }

    public nextTurn(): { [key: string]: Movable[] } {
        this._currentTurn++;
        // console.debug(`TurnClock:nextTurn - Start turn ${this._currentTurn}`);

        const actors: Movable[] = this.turnSchedule[this.currentTurn] || [];
        let playerTurn: boolean = false;
        actors.forEach((actor: Movable) => {
            if (actor instanceof Player) {
                playerTurn = true;
            } else {
                console.debug(`TurnClock:nextTurn - Start %cenemy%c turn ${this._currentTurn}`, 'color:red', 'color:black');
                actor.doTurn();
            }
        });

        this.cleanSchedule();

        if (!playerTurn) {
            // console.debug(`TurnClock:nextTurn - End of turn ${this._currentTurn}`);
            return this.nextTurn();
        }
        // console.debug(`TurnClock:nextTurn - End of turn ${this._currentTurn}`);

        return {[this.currentTurn]: this.turnSchedule[this.currentTurn]};
    }

    public scheduleTurn(actor: Movable, delta: number) {
        console.debug(`TurnClock::scheduleTurn - Scheduling turn for %c${actor.id}%c on turn ${this.currentTurn + delta}`,  `color:${actor instanceof Player ? 'green' : 'red'}`,'color:black');
        const turn = this.currentTurn + delta;
        if (!this.turnSchedule[turn]) {
            this.turnSchedule[turn] = [];
        }
        this.turnSchedule[turn].push(actor);
    }

    public cancelAllTurns(actor: Movable): void {
        Object.entries(this.turnSchedule).map(([turn, actors]: [string, Movable[]]) =>
            this.turnSchedule[turn] = actors.filter(a => a != actor)
        );
    }

    private cleanSchedule() {
        const keysToDelete = Object.keys(this.turnSchedule)
        .filter((k: string) => parseInt(k) < this._currentTurn);
        const deletedEntries: { [key: number]: Movable[] } = keysToDelete.reduce(
            (k: string) => ({[k]: this.turnSchedule[k]}), {}
        );

        keysToDelete.forEach(k => delete this.turnSchedule[k]);

        return deletedEntries;
    }

    public get currentTurn(): number {
        return this._currentTurn;
    }
}
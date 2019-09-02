import {Game} from '@app/game/game';
import {Application} from 'pixi.js';

export const game = new Game();

const app: Application = new Application({
    width: Game.width,
    height: Game.height,
    backgroundColor: 0x1099bb,
    sharedTicker: false
});

// create view in DOM
document.body.appendChild(app.view);

game.init(app);



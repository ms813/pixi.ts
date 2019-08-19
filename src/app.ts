import {Game} from '@app/game/game';
import {Application} from 'pixi.js';

const app: Application = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    sharedTicker: false
});

// create view in DOM
document.body.appendChild(app.view);

new Game(app);

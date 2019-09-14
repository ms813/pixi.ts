import {LevelMapGenerator} from '@app/game/map/generator/level-map.generator';
import {LevelMap} from '@app/game/map';

export class TunnelerGenerator implements LevelMapGenerator {
    private map: LevelMap;


    discovered(discovered: boolean): TunnelerGenerator {
        this.map.tiles.forEach(t => t.isDiscovered = discovered);
        return this;
    }

    fog(fog: boolean): TunnelerGenerator {
        this.map.fog = false;
        this.map.tiles.forEach(t => t.isVisible = fog);
        return this;
    }

    build(): LevelMap {
        return this.map;
    }
}
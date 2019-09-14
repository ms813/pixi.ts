import {LevelMap} from '@app/game/map';

export interface LevelMapGenerator {
    build(): LevelMap;

    fog(fog: boolean): LevelMapGenerator;

    discovered(discovered: boolean): LevelMapGenerator
}
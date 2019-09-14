import {PlayableCardView} from '@app/game/card/playable-card.view';
import {TargetingType} from '@app/game/card/targeting-type';
import {CardDefinition} from '@app/game/card/dictionary/card-dictionary';
import {DragEndData} from '@app/game/card/drag-end.data';

export class Card {

    public readonly name: string;
    public readonly view: PlayableCardView;
    public readonly targeting: TargetingType;
    public readonly range: number;
    public readonly speed: number;
    public readonly onPlay: ((dragEndData: DragEndData, options?: any) => void)[] = [];
    public readonly onDraw: Function[] = [];
    public readonly onDiscard: Function[] = [];
    public readonly onAddToDeck: Function[] = [];
    public readonly displayName: string;

    constructor(defn: CardDefinition) {
        this.name = defn.name;
        this.displayName = defn.displayName;
        this.targeting = TargetingType[defn.targeting as keyof typeof TargetingType];
        this.view = new PlayableCardView(this);
        this.range = defn.range;
        this.speed = defn.speed;
    }
}


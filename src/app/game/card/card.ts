import {CardView} from '@app/game/card/card.view';
import {TargetingType} from '@app/game/card/targeting-type';
import {CardActionDefinition, CardActionDictionary, CardDefinition} from '@app/game/card/dictionary/card-dictionary';

export class Card {

    public readonly name: string;
    public readonly view: CardView;
    public readonly targeting: TargetingType;
    public readonly range: number;
    public readonly onPlay: Function;
    public readonly onDraw: Function;
    public readonly onDiscard: Function;
    public readonly onAddToDeck: Function

    constructor({name, targeting, range, onPlay, onDraw, onDiscard, onAddToDeck}: CardDefinition) {
        this.name = name;
        this.targeting = TargetingType[targeting as keyof typeof TargetingType];
        this.view = new CardView(this);
        this.range = range;
        // this.onPlay = CardActionDictionary.get()
    }
}


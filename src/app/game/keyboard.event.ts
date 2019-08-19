export class Key {
    public press: () => void;
    public release: () => void;
    public subscribe: () => void;
    public unsubscribe: () => void;
    private value: string;
    private isDown: boolean;
    private isUp:boolean;
    private downHandler: (event:any) => void;
    private upHandler: (event:any) => void;

    public static create(value: string): Key {
        const key: Key = new Key();
        key.value = value;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;

        key.downHandler = (event: any) => {
            if (event.key === key.value) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
                event.preventDefault();
            }
        };

        key.upHandler = (event: any) => {
            if (event.key === key.value) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
                event.preventDefault();
            }
        };

        const downListener = key.downHandler.bind(key);
        const upListener = key.upHandler.bind(key);

        key.unsubscribe = () => {
            window.removeEventListener('keydown', downListener);
            window.removeEventListener('keyup', upListener);
        };

        key.subscribe = () => {
            window.addEventListener('keydown', downListener, false);
            window.addEventListener('keyup', upListener, false);
        };

        return key;
    }
}

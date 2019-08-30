export class Key {
    public press: () => void;
    public release: () => void;
    public subscribe: () => void;
    public unsubscribe: () => void;
    private code: string;
    private isDown: boolean;
    private isUp:boolean;
    private downHandler: (event:any) => void;
    private upHandler: (event:any) => void;

    public static create(code: string, press?: () => void): Key {
        const key: Key = new Key();

        key.code = code;
        key.isDown = false;
        key.isUp = true;
        key.press = press;
        key.release = undefined;

        key.downHandler = (event: any) => {
            if (event.code === key.code) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
                event.preventDefault();
            }
        };

        key.upHandler = (event: any) => {

            if (event.code === key.code) {
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

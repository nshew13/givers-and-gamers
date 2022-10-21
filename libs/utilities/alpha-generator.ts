// adapted from https://stackoverflow.com/a/12504061/356016

/**
 * tools for using alphabetic marbles in testing RxJS
 */
export class AlphaGenerator {
    public static readonly CHARS_LOWER = 'abcdefghijklmnopqrstuvwxyz';

    private _chars: string;
    private _indices: number[];

    constructor(startAt = 'a', chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
        this._chars = chars;
        /*
         * By using an array, we can cycle from Z to aa, ZZ to aaa, etc.,
         * rather than repeat the 52 singles. Think of them as place values
         * that map to a
         */
        this._indices = [chars.indexOf(startAt)];
    }

    next(): string {
        const r = [];
        for (const charIndex of this._indices) {
            r.unshift(this._chars[charIndex]);
        }
        this._increment();
        return r.join('');
    }

    /**
     * increments each index in _indices, rolling over with a new index as needed
     */
    private _increment(): void {
        // look at each index...
        for (let i = 0; i < this._indices.length; i++) {
            // increment it by 1...
            const val = ++this._indices[i];
            // if that exceeds last character, wrap back to 0...
            if (val >= this._chars.length) {
                this._indices[i] = 0;
            } else {
                // exit function before adding new index
                return;
            }
        }
        // and add a second index
        this._indices.push(0);
    }

    *[Symbol.iterator] (): IterableIterator<string> {
        while (true) {
            yield this.next();
        }
    }
}

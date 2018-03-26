const fmt = (num, type) => {
    const sign = Math.abs(num) == num ? '' : '-';
    num = Math.abs(num);
    switch (type) {
        case '$':
            return `${sign}$${Math.round(num * 100) / 100}`;
        case '%':
            return `${sign}${Math.round(num * 100) / 100}%;`
        default:
            throw new Error(`${type} is not a recognized type for the fmt formatter function.`);
    }
}

class HTTPCache {

    constructor({
        timeLimit = 300, // seconds
        sizeLimit = 1000, // entries
    } = {}) {
        this._size = 0;
        this._cache = {};
    }

    add(key, valuePromise) {
        this._size ++;
        this._cache[key] = valuePromise;

        return valuePromise; // return for chaining
    }

    has(key) {
        return key in this._cache;
    }

    get(key) {
        if (key in this._cache) {
            return this._cache[key];
        } else {
            return null;
        }
    }

    clear(key = null) {
        if (key === null) {
            this._cache = {};
        } else {
            delete this._cache[key];
        }
    }

}


module.exports = {
    fmt,
    HTTPCache,
}


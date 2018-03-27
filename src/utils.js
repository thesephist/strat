/**
 * @function fmt
 *
 * Format a given number into a string of: '$', '%'
 *
 * @throws Error - when an incorrect type specifier is given
 *
 * @param {number} num - real number to format
 * @param {string} type - what type of formatting applies, one of '$', '%'
 *
 * @returns {string} - formatted number as a string
 */
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

/**
 * @class HTTPCache
 *
 * A minimal HTTP response cache, to help avoid exceeding API rate limiting when frequent identical requests are made.
 */
class HTTPCache {

    /**
     * @param {Object} options - options for the cache, all optional
     *      {number} timeLimit - cache entry expiry limit in seconds
     *      {number} sizeLimit - max size for cache, after which it'll start using LRU elimination
     */
    constructor({
        timeLimit = 300, // seconds
        sizeLimit = 1000, // entries
    } = {}) {
        this._size = 0;
        this._cache = {};

        // TODO: actually enforce these limits given in the options hash
    }

    /**
     * Add an HTTP response entry to the key value store.
     *
     * @param {string} key - key for the entry (probably going to be a request URI)
     * @param {Promise} valuePromise - promise that resolves to the value of the entry, most likely an HTTP response
     *
     * @returns {Promise} - the given promise object, passed on for optional chaining of function calls
     */
    add(key, valuePromise) {
        this._size ++;
        this._cache[key] = valuePromise;

        return valuePromise; // return for chaining
    }

    /**
     * Check for a cache hit for a key
     *
     * @param {string} key - the key to check if the cache has
     *
     * @returns {boolean} - hit or miss
     */
    has(key) {
        return key in this._cache;
    }

    /**
     * Retrieve the value from the key-value store by a key
     *
     * @param {string} key - the key used to find the correct cached value, most likely a uri
     *
     * @returns {Promise} - a promise that resolves to the value, most likely an HTTP response value
     */
    get(key) {
        if (key in this._cache) {
            return this._cache[key];
        } else {
            return null;
        }
    }

    /**
     * Clear the cache
     *
     * @param {string|null} key - key used to identify which entry to clear; if not given, it will clear the entire cache
     */
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


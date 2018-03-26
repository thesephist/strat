class Historical {

    constructor({
        security,
        begins_at,
        open_price,
        close_price,
        high_price,
        low_price,
        volume,
    }) {
        this._security = security;
        this._timestamp = new Date(begins_at);
        this._open_price = +open_price;
        this._close_price = +close_price;
        this._high_price = +high_price;
        this._low_price = +low_price;
        this._volume = +volume;
    }

    get security() {
        return this._security;
    }

    get timestamp() {
        return this._timestamp;
    }

    get open_price() {
        return this._open_price;
    }

    get close_price() {
        return this._close_price;
    }

    get high_price() {
        return this._high_price;
    }

    get low_price() {
        return this._low_price;
    }

    get volume() {
        return this._volume;
    }

    isAfter(datetime, inclusive = true) {
        if (inclusive) {
            return this.timestamp >= datetime;
        } else {
            return this.timestamp > datetime;
        }
    }

    ifBefore(datetime, inclusive = true) {
        if (inclusive) {
            return this.timestamp <= datetime;
        } else {
            return this.timestamp < datetime;
        }
    }

    toString() {
        return `Historical for ${this.security.symbol}, $${this.close_price} at ${this.timestamp}`;
    }

}

module.exports = {
    Historical,
}


const { api } = require('../api.js');

const { Security } = require('./security.js');

class Trade {

    constructor({
        datetime,
        security,
        volume = 1,
    }) {
        if (!(datetime instanceof Date)) {
            throw new Error(`datetime (${datetime}) for a Trade instance should be a Date object.`);
        }
        if (!(security instanceof Security)) {
            throw new Error(`security (${security}) for a Trade instance should be a Security object.`);
        }

        this._datetime = datetime;
        this._security = security;
        this._volume = ~~volume;
    }

    get datetime() {
        return this._datetime;
    }

    set datetime(datetime) {
        this._datetime = datetime;
    }

    get security() {
        return this._security;
    }

    set security(security) {
        this._security = security;
    }

    get volume() {
        return this._volume;
    }

    set volume(volume) {
        this._volume = ~~volume;
    }

    get price() {
        const share_price = this.security.getPriceAt(this.datetime);
        return this._volume * share_price;
    }

    get revenue() {
        return -this.price;
    }

    get isBuy() {
        return this.volume > 0;
    }

    get isSell() {
        return this.volume < 0;
    }

    toString() {
        return `Trade for ${this.volume} shares of ${this.security.symbol} at ${this.datetime}`;
    }

    static profit(buy, sell) {
        if (!buy.isBuy) {
            throw new Error('The "buy" trade of Trade.profit must be a buy trade, but was not.');
        }
        if (!sell.isSell) {
            throw new Error('The "sell" trade of Trade.profit must be a sell trade, but was not.');
        }

        return buy.revenue + sell.revenue;
    }

}

module.exports = {
    Trade,
}


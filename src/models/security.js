const { api } = require('../api.js');

const { Historical } = require('./historical.js');

class Security {

    constructor({
        symbol,
        historicals = [],
        last_trade_price = null,
        ask_price = null,
        open_price = null,
        previous_close_price = null,
    }) {
        if (symbol === undefined) {
            throw new Error('A securiy\'s symbol must be defined, but was not defined here.');
        }

        this._symbol = symbol;
        this._historicals = historicals.map(props => new Historical({...props, security: this}));
        this._last_trade_price = +last_trade_price;
        this._ask_price = +ask_price;
        this._open_price = +open_price;
        this._previous_close_price = +previous_close_price;
    }

    get symbol() {
        return this._symbol;
    }

    get historicals() {
        return this._historicals;
    }

    get last_trade_price() {
        return this._last_trade_price;
    }

    get ask_price() {
        return this._ask_price;
    }

    get open_price() {
        return this._open_price;
    }

    get previous_close_price() {
        return this._previous_close_price;
    }

    getPriceAt(datetime) {
        // NOTE: using closing price for all historicals as the canonical "price"
        function comparator(h) {
            return Math.abs(h.timestamp - datetime);
        }
        const closestHistorical = this.historicals.slice().sort((h1, h2) => comparator(h1) - comparator(h2))[0]
        console.log(closestHistorical.toString());
        return closestHistorical.close_price;
    }

    getHistoricals(start_date, end_date) {
        if (
            start_date instanceof Date
            && end_date instanceof Date
        ) {
            return this.historicals.filter(historical => {
                return historical.isAfter(start_date) && historical.isBefore(end_date);
            });
        } else {
            throw new Error(`Both start_date (${start_date}) and end_date (${end_date}) must be Date objects for Security.getHistoricals`);
        }
    }

    toString() {
        return `Security [${this.symbol}]`;
    }

}

module.exports = {
    Security,
}


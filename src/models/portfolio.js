const { api } = require('../api.js');
const { fmt } = require('../utils.js');

const { Security } = require('./security.js');
const { Trade } = require('./trade.js');

class Portfolio {

    constructor(assets) {
        if (assets instanceof Array) {
            this._assets = [];
            for (const {symbol, volume} of assets) {
                this._assets.push({
                    symbol,
                    volume,
                });
            }
        } else if (assets instanceof Object) {
            this._assets = [];
            for (const [symbol, volume] of Object.entries(assets)) {
                this._assets.push({
                    symbol,
                    volume,
                });
            }
        }
    }

    get symbols() {
        return this._assets.map(a => a.symbol);
    }

    getSecurityVolume(security) {
        return this._assets.filter(a => a.symbol === security.symbol)[0].volume;
    }

    getValueAt(datetime = new Date()) {
        // TODO
    }

    getProfits(start_date, end_date) {
        if (end_date - start_date < 1000 * 60 * 60 * 24) {
            throw new Error(`Portfolio.getProfits only takes start and end dates that are at least a day apart, not ${start_date} - ${end_date}.`);
        } else {
            return new Promise((res, _) => {
                api.historicals(this.symbols, {
                    interval: 'day',
                    span: 'year',
                }).then(resp => {
                    const profits = resp.map(dict => new Security(dict))
                        .map(security => {
                            return {
                                buy: new Trade({
                                    security,
                                    datetime: start_date,
                                    volume: this.getSecurityVolume(security),
                                }),
                                sell: new Trade({
                                    security,
                                    datetime: end_date,
                                    volume: -this.getSecurityVolume(security),
                                }),
                            }
                        })
                        .map(trades => {
                            return Trade.profit(trades.buy, trades.sell);
                        })
                        .reduce((x, y) => x + y);

                    res(profits);
                });
            });
        }
    }

    getPrices(date) {
        return new Promise((res, _) => {
            api.historicals(this.symbols, {
                interval: 'day',
                span: 'year',
            }).then(resp => {
                const profits = resp.map(dict => new Security(dict))
                    .map(security => {
                        return new Trade({
                            security,
                            datetime: date,
                            volume: this.getSecurityVolume(security),
                        });
                    })
                    .map(buyTrade => buyTrade.price)
                    .reduce((x, y) => x + y);

                res(profits);
            });
        });
    }

    async rescale(date, available_funds) {
        const unitPrice = await this.getPrices(date);
        const scaleFactor = ~~(available_funds / unitPrice);
        if (scaleFactor < 1) {
            return; // do nothing
        } else {
            for (const item of this._assets) {
                item.volume *= scaleFactor;
            }
        }
    }

    async formattedTx(start_date, end_date, available_funds) {
        await this.rescale(start_date, available_funds);
        const pricesPromise = this.getPrices(start_date);
        const profitsPromise = this.getProfits(start_date, end_date);
        const prices = await pricesPromise;
        const profits = await profitsPromise;
        const profitsPct = profits / prices * 100;

        return `${fmt(prices, '$')}/${fmt(available_funds, '$')} invested, with ${fmt(profitsPct, '%')} change of ${fmt(profits, '$')} to ${fmt(prices + profits, '$')}`;
    }

    toString() {
        return `Portfolio of ${this._assets.map(a => `${a.symbol} (${a.volume})`).join(', ')}`;
    }

}

module.exports = {
    Portfolio,
}


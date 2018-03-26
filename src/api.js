const request = require('request');
const { HTTPCache } = require('./utils.js');

const RHOOD_HTTPS_ROOT = 'https://api.robinhood.com';
const API_GET_CACHE = new HTTPCache();

const apiget = (root, path = '', params = {}) => {
    const serializedParams = Object.entries(params)
        .map(pair => pair.map(c => encodeURI(c)).join('='))
        .join('&');
    const uri = `${root}${path}?${serializedParams}`;

    if (API_GET_CACHE.has(uri)) {
        console.log('CACHED URI:', uri);
        return API_GET_CACHE.get(uri);
    } else {
        console.log('REQUEST URI:', uri);
        return API_GET_CACHE.add(
            uri,
            new Promise((res, rej) => {
                request(uri, (error, response, body) => {
                    if (error) {
                        rej(error);
                    }

                    try {
                        const jsonBody = JSON.parse(body);
                        if ('results' in jsonBody) {
                            res(jsonBody.results);
                        } else {
                            res(jsonBody);
                        }
                    } catch (e) {
                        rej(e);
                    }
                });
            })
        );
    }
};

const api = {
    get: apiget,
    quote: ticker => {
        if (typeof ticker === string) {
            return apiget(RHOOD_HTTPS_ROOT, `/quotes/${ticker.toUpperCase()}`);
        } else {
            throw new Error('Ticker supplied to api.quote must be a string.');
        }
    },
    quotes: tickers => {
        if (tickers instanceof Array) {
            return apiget(RHOOD_HTTPS_ROOT, '/quotes/', {
                symbols: tickers.map(t => t.toUpperCase()),
            });
        } else {
            throw new Error('Tickers supplied to api.quotes must be in array form.');
        }
    },
    historical: (ticker, {interval, span, bounds} = {}) => {
        const INTERVAL_CHOICES = ['week', 'day', '10minute', '5minute'];
        const SPAN_CHOICES = ['day', 'week', 'year', '5year', 'all'];
        const BOUNDS_CHOICES = ['extended', 'regular', 'trading'];

        if (typeof ticker === string) {
            if (!interval) {
                throw new Error(`Interval supplied to api.historical must be one of: ${INTERVAL_CHOICES.join(', ')}, not ${interval}.`);
            }
            if (!span) {
                throw new Error(`Span supplied to api.historical must be one of: ${SPAN_CHOICES.join(', ')}, not ${span}.`);
            }
            if (!bounds) {
                throw new Error(`Bounds supplied to api.historical must be one of: ${BOUNDS_CHOICES.join(', ')}, not ${bounds}.`);
            }

            return apiget(RHOOD_HTTPS_ROOT, `/quotes/historicals/${ticker}/`, {
                interval,
                span,
                bounds,
            });
        } else {
            throw new Error('Ticker supplied to api.historical must be a string.');
        }
    },
    historicals: (tickers, {interval, span, bounds} = {}) => {
        const INTERVAL_CHOICES = ['week', 'day', '10minute', '5minute'];
        const SPAN_CHOICES = ['day', 'week', 'year', '5year', 'all'];
        const BOUNDS_CHOICES = ['extended', 'regular', 'trading'];

        if (tickers instanceof Array) {
            if (!interval || !INTERVAL_CHOICES.includes(interval)) {
                throw new Error(`Interval supplied to api.historicals must be one of: ${INTERVAL_CHOICES.join(', ')}, not ${interval}.`);
            }
            if (!span || !SPAN_CHOICES.includes(span)) {
                throw new Error(`Span supplied to api.historicals must be one of: ${SPAN_CHOICES.join(', ')}, not ${span}.`);
            }
            if (bounds && !BOUNDS_CHOICES.includes(bounds)) {
                // NOTE: bounds is optional, as the API falls back on sane defaults here
                throw new Error(`Bounds supplied to api.historicals must be one of: ${BOUNDS_CHOICES.join(', ')}, not ${bounds}.`);
            }

            const options = {
                symbols: tickers,
                interval,
                span,
            }
            if (bounds) options.bounds = bounds;

            return apiget(RHOOD_HTTPS_ROOT, '/quotes/historicals/', options);
        } else {
            throw new Error('Tickers supplied to api.historicals must be in array form.');
        }
    },
};

module.exports = {
    api,
}


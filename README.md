# Strat

Minimal toolkit for futures, options, and commodities trading strategy testing.

## Motivation

I'm a pretty frequent trader and wanted to experiemnt with some basic trading strategies, to backtest them against existing, recent, high-resolution data. But there's a pretty big gap for 1) available data sources, and more importantly 2) an ergonomic, high-level API.

So `strat` aims to alleviate 1) by having a flexible-enough backend API that's able to hook into existing data sources or API's, and solve 2) with a simple, high-level Node API around trading strategies and simulated portfolios.

The initial API backend for Strat was built atop excellent sluthing from [sanko/Robinhood](https://github.com/sanko/Robinhood) and its documentation of the (admittedly super nice) internal Robinhood API.

## Documentation

for now, documentation for Strat's APIs is provided within each file.

## License

This code is licensed under the MIT Open-Source license. See the `LICENSE` file for more information.


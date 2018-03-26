const { Portfolio } = require('./src/models/portfolio.js');

(async () => {
    // some math
    const ptf = new Portfolio({
        QQQ: 1,
        SPY: 1,
        DIA: 1,
    });
    const start = new Date('2018-01-01');
    const end = new Date();

    console.log(ptf.toString());
    ptf.formattedTx(start, end, 7000).then(v => console.log(v));
})();


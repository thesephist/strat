class Strategy {

    constructor() {

    }

}

class TimeStrategy extends Strategy {
    
    constructor(buy_interval, sell_interval) {
        super();
    }

}

class BoundsStrategy extends Strategy {

    constructor(buy_bound, sell_bound) {
        super();
    }

}

class DollarCostAverageStrategy extends Strategy {

}

module.exports = {
    Security,
    TimeStrategy,
    BoundsStrategy,
    DollarCostAverageStrategy,
}

